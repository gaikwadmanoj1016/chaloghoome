// utils/slugify.ts
// export function slugify(text: string, character: string = '-'): string {
//     return text
//         .toLowerCase()
//         .trim()
//         .replace(/\s+/g, character) // replace spaces
//         .replace(/[^\w\-]+/g, '')   // remove non-word characters
//         .replace(/\-\-+/g, character); // collapse multiple separators
// }
export function slugify(text: string, character: string = '-'): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, character)              // replace spaces with hyphen
        .replace(new RegExp(`[^\\p{L}\\p{N}\\-]+`, 'gu'), '') // allow letters (including accented), numbers, and hyphen
        .replace(/\-\-+/g, character)            // collapse multiple hyphens
        .replace(/^-+|-+$/g, '');                // trim hyphens from start/end
}

// Converts "my-example-text" to "My Example Text"
export function convertSlugToNormal(slug: string, character: string = '-'): string {
    if (slug) {
        return slug
            .split(character)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return '';
}