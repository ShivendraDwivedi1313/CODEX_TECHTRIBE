/**
 * Simple HTML sanitization for user-generated content.
 * Strips all HTML tags to prevent XSS attacks.
 *
 * For rich text support, replace this with a library like
 * DOMPurify or sanitize-html that allows a safe subset of tags.
 */

const HTML_TAG_RE = /<[^>]*>/g
const SCRIPT_RE = /<script[\s\S]*?<\/script>/gi
const EVENT_HANDLER_RE = /\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi

/**
 * Strip all HTML tags from a string.
 * Use this for content that should be plain text only.
 */
export function stripHtml(input: string): string {
  return input
    .replace(SCRIPT_RE, '')
    .replace(HTML_TAG_RE, '')
    .replace(EVENT_HANDLER_RE, '')
    .trim()
}


