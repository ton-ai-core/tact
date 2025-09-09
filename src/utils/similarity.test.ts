import { describe, it, expect } from "@jest/globals";
import { 
    compositeScore, 
    findSimilarFunctions, 
    jaro, 
    jaroWinkler, 
    splitIdentifier, 
    normalize 
} from "./similarity";

describe('Similarity algorithm tests', () => {
    describe('Core algorithms', () => {
        it('should calculate Jaro similarity correctly', () => {
            expect(jaro('', '')).toBe(1);
            expect(jaro('a', '')).toBe(0);
            expect(jaro('', 'a')).toBe(0);
            expect(jaro('abc', 'abc')).toBe(1);
            expect(jaro('martha', 'marhta')).toBeCloseTo(0.944, 2);
            expect(jaro('set', 's1et')).toBeGreaterThan(0.5);
        });

        it('should calculate Jaro-Winkler similarity correctly', () => {
            expect(jaroWinkler('', '')).toBe(1);
            expect(jaroWinkler('abc', 'abc')).toBe(1);
            expect(jaroWinkler('martha', 'marhta')).toBeCloseTo(0.961, 2);
            expect(jaroWinkler('set', 's1et')).toBeGreaterThan(0.6);
        });

        it('should split identifiers correctly', () => {
            expect(splitIdentifier('camelCase')).toEqual(['camel', 'case']);
            expect(splitIdentifier('snake_case')).toEqual(['snake', 'case']);
            expect(splitIdentifier('kebab-case')).toEqual(['kebab-case']);
            expect(splitIdentifier('PascalCase')).toEqual(['pascal', 'case']);
            expect(splitIdentifier('emptyMap')).toEqual(['empty', 'map']);
            expect(splitIdentifier('replaceGet')).toEqual(['replace', 'get']);
        });

        it('should normalize strings correctly', () => {
            expect(normalize('camelCase')).toBe('camelcase');
            expect(normalize('snake_case')).toBe('snakecase');
            expect(normalize('kebab-case')).toBe('kebabcase');
            expect(normalize('file.name')).toBe('filename');
            expect(normalize('path/to/file')).toBe('pathtofile');
        });
    });

    describe('Composite scoring', () => {
        it('should calculate correct similarity scores', () => {
            // Exact matches
            expect(compositeScore('del', 'del')).toBeCloseTo(1, 1);
            expect(compositeScore('set', 'set')).toBeCloseTo(1, 1);

            // High similarity (typos)
            expect(compositeScore('readFil', 'readFile')).toBeGreaterThan(0.7);
            expect(compositeScore('s1et', 'set')).toBeGreaterThan(0.3);
            expect(compositeScore('g3t', 'get')).toBeGreaterThan(0.3);
            expect(compositeScore('exsts', 'exists')).toBeGreaterThan(0.5);
            
            // Map function typos
            expect(compositeScore('replaceGt', 'replaceGet')).toBeGreaterThan(0.6);
            expect(compositeScore('deepEqals', 'deepEquals')).toBeGreaterThan(0.6);
            expect(compositeScore('isEmty', 'isEmpty')).toBeGreaterThan(0.5);
            expect(compositeScore('asCel', 'asCell')).toBeGreaterThan(0.6);

            // Global function typos
            expect(compositeScore('reqire', 'require')).toBeGreaterThan(0.5);
            expect(compositeScore('dmp', 'dump')).toBeGreaterThan(0.3);
            expect(compositeScore('nw', 'now')).toBeGreaterThan(0.3);
            expect(compositeScore('emptyMp', 'emptyMap')).toBeGreaterThan(0.5);
            expect(compositeScore('emptyM1ap', 'emptyMap')).toBeGreaterThan(0.5);

            // Low similarity
            expect(compositeScore('abc', 'xyz')).toBeLessThan(0.3);
            expect(compositeScore('completely', 'different')).toBeLessThan(0.3);
        });

        it('should be bounded in [0,1]', () => {
            const testCases: Array<[string, string]> = [
                ['readFil', 'readFile'],
                ['x', 'xxxxxxxxxxxxxxxx'],
                ['ABC', 'ABC'],
                ['s1et', 'set'],
                ['', ''],
                ['a', 'b']
            ];
            
            for (const [a, b] of testCases) {
                const score = compositeScore(a, b);
                expect(score).toBeGreaterThanOrEqual(0);
                expect(score).toBeLessThanOrEqual(1);
            }
        });

        it('should apply length penalty correctly', () => {
            // Shorter candidate should score higher than longer one with same prefix
            const shortScore = compositeScore('set', 'set');
            const longScore = compositeScore('set', 'setVeryLongFunctionName');
            expect(shortScore).toBeGreaterThan(longScore);
        });
    });

    describe('Function suggestions', () => {
        it('should find similar functions for map operations', () => {
            const mapFunctions = ['set', 'get', 'del', 'exists', 'isEmpty', 'asCell', 'deepEquals', 'replace', 'replaceGet'];
            
            const suggestions = findSimilarFunctions('s1et', mapFunctions);
            expect(suggestions.length).toBeGreaterThan(0);
            expect(suggestions[0]!.name).toBe('set');
            expect(suggestions[0]!.score).toBeGreaterThan(0.3);
        });

        it('should find similar functions for global operations', () => {
            const globalFunctions = ['require', 'dump', 'now', 'emptyMap', 'emptyCell', 'beginCell'];
            
            const suggestions = findSimilarFunctions('reqire', globalFunctions);
            expect(suggestions.length).toBeGreaterThan(0);
            expect(suggestions[0]!.name).toBe('require');
            expect(suggestions[0]!.score).toBeGreaterThan(0.5);
        });

        it('should return empty array when no similar functions found', () => {
            const functions = ['completely', 'different', 'words'];
            const suggestions = findSimilarFunctions('xyz', functions);
            expect(suggestions).toEqual([]);
        });

        it('should limit suggestions correctly', () => {
            const functions = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6'];
            
            // Test default limit (3)
            const suggestions3 = findSimilarFunctions('test', functions);
            expect(suggestions3.length).toBeLessThanOrEqual(3);
            
            // Test custom limit
            const suggestions2 = findSimilarFunctions('test', functions, 0.3, 2);
            expect(suggestions2.length).toBeLessThanOrEqual(2);
            
            // Test max limit (5)
            const suggestions10 = findSimilarFunctions('test', functions, 0.3, 10);
            expect(suggestions10.length).toBeLessThanOrEqual(5);
        });

        it('should sort suggestions by score descending', () => {
            const functions = ['set', 'get', 'test', 'rest', 'best'];
            const suggestions = findSimilarFunctions('set', functions);
            
            expect(suggestions.length).toBeGreaterThan(1);
            for (let i = 1; i < suggestions.length; i++) {
                expect(suggestions[i - 1]!.score).toBeGreaterThanOrEqual(suggestions[i]!.score);
            }
        });

        it('should filter by minimum score', () => {
            const functions = ['set', 'completely_different', 'xyz'];
            
            // With high threshold, should only get exact or very close matches
            const suggestions = findSimilarFunctions('set', functions, 0.8);
            expect(suggestions.length).toBe(1);
            expect(suggestions[0]!.name).toBe('set');
            
            // With low threshold, should get more matches
            const moreSuggestions = findSimilarFunctions('set', functions, 0.1);
            expect(moreSuggestions.length).toBeGreaterThan(suggestions.length);
        });

        it('should handle real Tact function examples', () => {
            const mapFunctions = ['set', 'get', 'del', 'exists', 'isEmpty', 'asCell', 'deepEquals', 'replace', 'replaceGet'];
            
            // Common typos
            expect(findSimilarFunctions('st', mapFunctions)[0]?.name).toBe('set');
            expect(findSimilarFunctions('gt', mapFunctions)[0]?.name).toBe('get');
            expect(findSimilarFunctions('dl', mapFunctions)[0]?.name).toBe('del');
            expect(findSimilarFunctions('exst', mapFunctions)[0]?.name).toBe('exists');
            
            const globalFunctions = ['require', 'dump', 'now', 'address', 'emptyMap', 'emptyCell'];
            expect(findSimilarFunctions('requr', globalFunctions)[0]?.name).toBe('require');
            expect(findSimilarFunctions('addres', globalFunctions)[0]?.name).toBe('address');
        });
    });
});