/**
 * Share utilities for AI Studio Build & Classroom Presentation
 * Handles conversion of restricted dev URLs (ais-dev-) to publicly accessible URLs (ais-pre-),
 * preventing 403 Forbidden errors for classmates and teachers.
 */

export function isDevDomain(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('ais-dev-');
}

export function getPublicShareUrl(params?: Record<string, string>): string {
  if (typeof window === 'undefined') {
    return 'https://ais-pre-efo6kjrrak3qzo6uhhavrw-481167042963.asia-northeast1.run.app';
  }

  try {
    const origin = window.location.origin.replace('ais-dev-', 'ais-pre-');
    const pathname = window.location.pathname;
    const url = new URL(origin + pathname);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        } else {
          url.searchParams.delete(key);
        }
      });
    }

    return url.toString();
  } catch {
    return window.location.href.replace('ais-dev-', 'ais-pre-');
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to document.execCommand
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
