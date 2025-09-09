/**
 * String similarity utilities for function name suggestions
 * Ported from the TypeScript ESLint plugin implementation
 */

/** Jaro similarity in [0,1] */
export function jaro(s1: string, s2: string): number {
    if (s1 === s2) return 1;
    const len1 = s1.length, len2 = s2.length;
    if (len1 === 0 || len2 === 0) return 0;

    const matchDistance = Math.floor(Math.max(len1, len2) / 2) - 1;
    const s1Matches = new Array<boolean>(len1).fill(false);
    const s2Matches = new Array<boolean>(len2).fill(false);
    let matches = 0, transpositions = 0;

    for (let i = 0; i < len1; i++) {
        const start = Math.max(0, i - matchDistance);
        const end = Math.min(i + matchDistance + 1, len2);
        for (let j = start; j < end; j++) {
            if (s2Matches[j]) continue;
            if (s1[i] !== s2[j]) continue;
            s1Matches[i] = true;
            s2Matches[j] = true;
            matches++;
            break;
        }
    }
    if (matches === 0) return 0;

    let k = 0;
    for (let i = 0; i < len1; i++) {
        if (!s1Matches[i]) continue;
        while (!s2Matches[k]) k++;
        if (s1[i] !== s2[k]) transpositions++;
        k++;
    }
    transpositions /= 2;

    return (matches / len1 + matches / len2 + (matches - transpositions) / matches) / 3;
}

/** Jaro–Winkler similarity in [0,1] with p=0.1 (standard). */
export function jaroWinkler(s1: string, s2: string): number {
    const jw = jaro(s1, s2);
    let prefix = 0;
    for (let i = 0; i < Math.min(4, s1.length, s2.length); i++) {
        if (s1[i] === s2[i]) prefix++;
        else break;
    }
    return jw + prefix * 0.1 * (1 - jw);
}

/** Tokenization for identifiers: camelCase, underscores, spaces, digits. */
export function splitIdentifier(identifier: string): string[] {
    return identifier
        .split(/(?=[A-Z])|[_\s\d]/)
        .map(s => s.toLowerCase())
        .filter(Boolean);
}

/** Normalization: lowercasing and removing common separators and dots for paths. */
export function normalize(str: string): string {
    return str.toLowerCase().replace(/[_\s./-]/g, '');
}

function longestCommonPrefix(a: string, b: string): number {
    const n = Math.min(a.length, b.length);
    let i = 0;
    while (i < n && a[i] === b[i]) i++;
    return i;
}

function jaccardTokens(a: string, b: string): number {
    const A = new Set(splitIdentifier(a));
    const B = new Set(splitIdentifier(b));
    if (A.size === 0 && B.size === 0) return 1;
    if (A.size === 0 || B.size === 0) return 0;
    let inter = 0;
    for (const t of A) if (B.has(t)) inter++;
    return inter / (A.size + B.size - inter);
}

/** Composite similarity score S ∈ [0,1] with provable bounds. */
export function compositeScore(unknown: string, candidate: string): number {
    const A = normalize(unknown);
    const B = normalize(candidate);
    const jw = jaroWinkler(A, B);
    const tok = jaccardTokens(unknown, candidate);
    const cont = A.length > 0 && B.length > 0 && (A.includes(B) || B.includes(A)) ? 1 : 0;
    const pref = Math.min(longestCommonPrefix(A, B), 4) / 4;
    const base = 0.5 * jw + 0.3 * tok + 0.1 * cont + 0.1 * pref;

    // Length penalty: at most 0.15, linear by excess length
    const lengthPenalty = Math.min(0.15, Math.max(0, candidate.length - unknown.length) * 0.01);

    const s = base - lengthPenalty;
    return s <= 0 ? 0 : s >= 1 ? 1 : s;
}

/**
 * Find similar function names from a list of available functions
 * @param unknownName The unknown/misspelled function name
 * @param availableFunctions List of available function names
 * @param minScore Minimum similarity score to consider (default: 0.3)
 * @param maxSuggestions Maximum number of suggestions to return (default: 3, max 5)
 * @returns Array of suggested function names sorted by similarity score
 */
export function findSimilarFunctions(
    unknownName: string,
    availableFunctions: string[],
    minScore: number = 0.3,
    maxSuggestions: number = 3
): { name: string; score: number }[] {
    const suggestions = availableFunctions
        .map(funcName => ({
            name: funcName,
            score: compositeScore(unknownName, funcName)
        }))
        .filter(item => item.score >= minScore)
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
        .slice(0, Math.min(maxSuggestions, 5)); // Ограничиваем максимум 5 предложениями

    return suggestions;
}