function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const BRAND = {
  name: 'AI MedCheck',
  gradient: 'linear-gradient(135deg, #4f46e5 0%, #0ea5e9 100%)',
};

function layout(body: string, title: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td style="text-align:center;padding-bottom:24px;">
              <span style="background:${BRAND.gradient};-webkit-background-clip:text;background-clip:text;color:transparent;font-size:22px;font-weight:800;">${BRAND.name}</span>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:36px;box-shadow:0 4px 20px rgba(15,23,42,.08);">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="text-align:center;padding-top:24px;color:#94a3b8;font-size:12px;line-height:1.6;">
              AI MedCheck provides educational health insights only.<br/>It is not a diagnosis and never replaces professional medical advice.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  const safe = escapeHtml(href);
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;"><tr><td align="center">
    <a href="${safe}" style="background:${BRAND.gradient};color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:15px;font-weight:600;display:inline-block;">${escapeHtml(label)}</a>
  </td></tr></table>`;
}

function heading(text: string): string {
  return `<h1 style="margin:0 0 16px;font-size:22px;color:#0f172a;font-weight:700;">${escapeHtml(text)}</h1>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#475569;">${escapeHtml(text)}</p>`;
}

export function renderEmailTemplate(
  template: 'welcome' | 'verify-email' | 'reset-password',
  data: Record<string, string>,
): string {
  switch (template) {
    case 'welcome':
      return layout(
        heading(`Welcome to ${BRAND.name}, ${escapeHtml(data.name)}!`) +
          paragraph('Your account has been created. Please verify your email address to activate your account and start analyzing your medical reports.') +
          button(data.link, 'Verify my email') +
          paragraph('If the button does not work, copy and paste this link into your browser:') +
          paragraph(data.link),
        'Welcome to AI MedCheck',
      );

    case 'verify-email':
      return layout(
        heading('Verify your email address') +
          paragraph(`Hi ${escapeHtml(data.name)},`) +
          paragraph('Tap the button below to verify your email address. This link expires in 24 hours.') +
          button(data.link, 'Verify email') +
          paragraph('If the button does not work, copy and paste this link into your browser:') +
          paragraph(data.link),
        'Verify your email',
      );

    case 'reset-password':
      return layout(
        heading('Reset your password') +
          paragraph(`Hi ${escapeHtml(data.name)},`) +
          paragraph('We received a request to reset your password. Tap the button below to choose a new one. This link expires in 1 hour.') +
          button(data.link, 'Reset password') +
          paragraph('If you did not request this, you can safely ignore this email — your password will not change.') +
          paragraph('If the button does not work, copy and paste this link into your browser:') +
          paragraph(data.link),
        'Reset your password',
      );

    default:
      return layout(paragraph('Unknown email template'), 'AI MedCheck');
  }
}
