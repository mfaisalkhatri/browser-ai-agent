import { Locator } from "playwright";

export enum LocatorStrategy {
  ROLE = "role",
  LABEL = "label",
  PLACEHOLDER = "placeholder",
  ALT_TEXT = "altText",
  TITLE = "title",
  TEST_ID = "testId",
  TEXT = "text",
  CSS = "css",
  XPATH = "xpath",
}

export interface LocatorCandidate {
  strategy: LocatorStrategy;
  value: string;
  locator: Locator;
  confidence: number;
}

export interface ResolvedLocator {
  strategy: LocatorStrategy;
  value: string;
  locator: Locator;
  confidence: number;
  matches: number;
  visible: boolean;
  enabled: boolean;
}

export interface LocatorResolutionResult {
  success: boolean;
  resolved?: ResolvedLocator;
  message: string;
}