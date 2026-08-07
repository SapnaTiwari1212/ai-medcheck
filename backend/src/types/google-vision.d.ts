declare module '@google-cloud/vision' {
  export class ImageAnnotatorClient {
    constructor(options?: Record<string, unknown>);
    annotateImage(request: Record<string, unknown>): Promise<[Record<string, unknown>]>;
  }
}
