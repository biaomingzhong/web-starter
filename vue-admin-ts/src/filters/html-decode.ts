// @ts-ignore
import decode from "lean-he/decode";

/**
 * Decodes any named and numerical character references in text
 * @param {String} value
 */
export function htmlDecode (value: string) {
  return value ? decode(value) : ''
}
