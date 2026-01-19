// src/utils/text.ts
/**
 * Convert a string to Proper Case:
 * Capitalizes the first letter of every word.
 */
export function toProperCase(input: string): string {
    return input.toLowerCase().replace(/\b\w+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

/**
 * Convert a string to Title Case:
 * Capitalizes significant words, leaves small words lowercase unless first/last.
 */
export function toTitleCase(input: string): string {
    const smallWords = /^(a|an|and|as|at|but|by|for|in|nor|of|on|or|per|the|to|vs?)$/i;
    return input
        .toLowerCase()
        .split(/\s+/)
        .map((word, index, all) => {
            if (word.match(smallWords) && index !== 0 && index !== all.length - 1) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

/**
 * Convert a string to kebab-case:
 * Lowercase, spaces/underscores/camelCase → dashes.
 */
export function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') // split camelCase
        .replace(/\s+/g, '-') // spaces to dashes
        .replace(/_/g, '-') // underscores to dashes
        .toLowerCase();
}

export function surround(left: string, right: string) {
    return (s: string) => (s ? [left, s, right].join('') : s);
}

export const surroundParens = surround('(', ')');
export const surroundDblQuote = surround('"', '"');

export function camelCaseToProperCase(input: string): string {
    if (!input) return '';

    return (
        input
            // insert spaces before capital letters
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            // handle acronym boundaries like "JSONData" → "JSON Data"
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
            // lowercase everything, then capitalize first letter of each word
            .toLowerCase()
            .replace(/\b\w/g, (char) => char.toUpperCase())
    );
}
