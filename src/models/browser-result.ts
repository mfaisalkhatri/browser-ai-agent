export interface BrowserResult<T = unknown> {
  /**
   * Indicates whether the browser action completed successfully.
   */
  success: boolean;

  /**
   * Human-readable message describing the result.
   */
  message: string;

  /**
   * Current page URL.
   */
  url?: string;

  /**
   * Current page title.
   */
  title?: string;

  /**
   * Action-specific data.
   */
  data?: T;

  /**
   * Screenshot path, if applicable.
   */
  screenshotPath?: string;

  /**
   * Error message if the action failed.
   */
  error?: string;
}