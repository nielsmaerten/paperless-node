/**
 * Named placeholder values that may be interpolated into a URL template.
 */
export type PathParams = Record<string, string | number | boolean>;

/**
 * Replaces placeholders in the template with provided parameters and ensures they are URL-safe.
 */
export const buildPath = (template: string, params?: PathParams): string => {
  if (!params) {
    const missing = template.match(/\{(\w+)\}/);
    if (missing) {
      throw new Error(`Missing path parameter: ${missing[1]}`);
    }
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (!(key in params)) {
      throw new Error(`Missing path parameter: ${key}`);
    }
    const value = params[key];
    if (value === undefined || value === null) {
      throw new Error(`Path parameter '${key}' is ${value === null ? 'null' : 'undefined'}`);
    }
    return encodeURIComponent(String(value));
  });
};
