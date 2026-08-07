import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';

function asArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function cookieValue(setCookies: string | string[] | undefined, name: string): string {
  const raw = asArray(setCookies).find((c) => c.startsWith(`${name}=`));
  if (!raw) throw new Error(`Cookie ${name} not set`);
  return raw.split(';')[0].slice(`${name}=`.length);
}

describe('App (e2e)', () => {
  let app: INestApplication;
  let server: ReturnType<INestApplication['getHttpServer']>;

  const uniqueEmail = `e2e-${Date.now()}@example.com`;
  const password = 'SecurePass123';
  let accessToken: string;
  let refreshTokenCookie: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }),
    );
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /health reports the database and redis as up', async () => {
    const res = await request(server).get('/api/health').expect(200);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.info.database.status).toBe('up');
    expect(res.body.data.info.redis.status).toBe('up');
  });

  it('POST /auth/register creates a user and sets auth cookies', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({ email: uniqueEmail, password, fullName: 'E2E User', preferredLanguage: 'en' })
      .expect(201);

    expect(res.body.data.user.email).toBe(uniqueEmail);
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(cookieValue(res.headers['set-cookie'], 'access_token')).toBeDefined();
    expect(cookieValue(res.headers['set-cookie'], 'refresh_token')).toBeDefined();
  });

  it('POST /auth/login returns tokens and sets the refresh cookie', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({ email: uniqueEmail, password })
      .expect(200);

    accessToken = cookieValue(res.headers['set-cookie'], 'access_token');
    refreshTokenCookie = asArray(res.headers['set-cookie']).find((c) => c.startsWith('refresh_token='))!;
    expect(accessToken).toBeDefined();
    expect(refreshTokenCookie).toBeDefined();
  });

  it('GET /users/me requires authentication', async () => {
    await request(server).get('/api/users/me').expect(401);
  });

  it('GET /users/me returns the profile when authenticated', async () => {
    const res = await request(server)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body.data.email).toBe(uniqueEmail);
    expect(res.body.data.fullName).toBe('E2E User');
  });

  it('POST /auth/refresh rotates the session using the cookie', async () => {
    const res = await request(server)
      .post('/api/auth/refresh')
      .set('Cookie', refreshTokenCookie)
      .expect(200);

    expect(res.body.data.message).toBe('Session refreshed');
    expect(cookieValue(res.headers['set-cookie'], 'access_token')).toBeDefined();
  });
});
