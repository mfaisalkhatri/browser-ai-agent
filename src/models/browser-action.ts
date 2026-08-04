/**
 * Supported browser actions that can be executed by BrowserService.
 */
export enum BrowserActionType {
  GOTO = "goto",
  CLICK = "click",
  TYPE = "type",
  PRESS = "press",
  WAIT = "wait",
  EXTRACT_TEXT = "extract_text",
  GET_TITLE = "get_title",
  GET_URL = "get_url",
  SCREENSHOT = "screenshot",
  CLOSE = "close",
}

/**
 * Generic browser action.
 *
 * Each action uses only the properties it needs.
 *
 * Examples:
 *
 * GOTO
 * {
 *   action: BrowserActionType.GOTO,
 *   url: "https://github.com"
 * }
 *
 * CLICK
 * {
 *   action: BrowserActionType.CLICK,
 *   locator: "button[type='submit']"
 * }
 *
 * TYPE
 * {
 *   action: BrowserActionType.TYPE,
 *   locator: "#search",
 *   text: "Browser Cloud"
 * }
 */
export interface BrowserAction {
  action: BrowserActionType;

  /**
   * URL to navigate to.
   */
  url?: string;

  /**
   * Playwright locator.
   */
  locator?: string;

  /**
   * Text to type.
   */
  text?: string;

  /**
   * Keyboard key.
   * Example: Enter, Escape, Tab
   */
  key?: string;

  /**
   * Wait duration in milliseconds.
   */
  timeout?: number;

  /**
   * File path for screenshots.
   */
  path?: string;
}