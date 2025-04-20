// utils/slugify.ts
export function slugify(text: string, character: string = '-'): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, character) // replace spaces
        .replace(/[^\w\-]+/g, '')   // remove non-word characters
        .replace(/\-\-+/g, character); // collapse multiple separators
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