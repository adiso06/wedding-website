/**
 * Browser detection utility
 * Detects Chrome, Firefox, and Safari on both desktop and mobile
 */

export interface BrowserInfo {
  name: 'chrome' | 'firefox' | 'safari' | 'unknown';
  isMobile: boolean;
}

export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipad|ipod/i.test(ua);

  // Check for Safari first (must be before Chrome check)
  // Safari's UA contains both 'safari' and sometimes 'chrome'
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isSafari) {
    return { name: 'safari', isMobile };
  }

  // Check for Chrome (includes Edge Chromium, Opera, etc.)
  const isChrome = /chrome|crios|crmo/i.test(ua) && !/edg/i.test(ua);
  if (isChrome) {
    return { name: 'chrome', isMobile };
  }

  // Check for Firefox
  const isFirefox = /firefox|fxios/i.test(ua);
  if (isFirefox) {
    return { name: 'firefox', isMobile };
  }

  return { name: 'unknown', isMobile };
}

/**
 * Get browser-specific CSS class
 */
export function getBrowserClass(): string {
  const { name, isMobile } = detectBrowser();
  return `browser-${name}${isMobile ? '-mobile' : '-desktop'}`;
}
