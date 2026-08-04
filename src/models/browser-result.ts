export interface BrowserResult<T = unknown> {
  success: boolean;

  message: string;

  data?: T;

  error?: string;
}
