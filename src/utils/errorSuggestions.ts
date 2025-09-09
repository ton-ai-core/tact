import { findSimilarFunctions } from "./similarity";
import { throwCompilationError } from "@/error/errors";
import type { SrcInfo } from "@/grammar";
import { files } from "@/stdlib/stdlib";
import { 
    getFunctionSignature,
    getMapFunctionSignatures,
    getGlobalFunctionSignatures
} from "./functionSignatures";

/**
 * Get function signatures map based on function type
 */
function getFunctionSignaturesMap(functionType: string): Map<string, string> {
    switch (functionType.toLowerCase()) {
        case "map function":
            return getMapFunctionSignatures();
        case "global function":
            return getGlobalFunctionSignatures();
        default:
            return new Map();
    }
}

/**
 * Throw a compilation error with function suggestions when a function is not found
 * @param unknownFunction The unknown/misspelled function name
 * @param availableFunctions Array of available function names
 * @param functionType Type of function for error message (e.g., "Map function", "Global function")
 * @param location Source location for the error
 */
export function throwFunctionNotFoundWithSuggestions(
    unknownFunction: string,
    availableFunctions: string[],
    functionType: string,
    location: SrcInfo
): never {
    const suggestions = findSimilarFunctions(unknownFunction, availableFunctions);
    
    if (suggestions.length > 0) {
        const signaturesMap = getFunctionSignaturesMap(functionType);
        const suggestionText = suggestions.map(s => {
            const signature = signaturesMap.get(s.name);
            return signature ? `  - ${signature}` : `  - ${s.name}`;
        }).join('\n');
        
        throwCompilationError(
            `${functionType} "${unknownFunction}" not found. Did you mean:\n${suggestionText}`,
            location
        );
    } else {
        throwCompilationError(
            `${functionType} "${unknownFunction}" not found`,
            location
        );
    }
}

/**
 * Throw a compilation error with field suggestions when a field is not found
 * @param unknownField The unknown/misspelled field name
 * @param availableFields Array of available field names with their types
 * @param typeName Name of the type containing the fields
 * @param location Source location for the error
 */
export function throwFieldNotFoundWithSuggestions(
    unknownField: string,
    availableFields: Array<{name: string, type: string}>,
    typeName: string,
    location: SrcInfo
): never {
    const fieldNames = availableFields.map(f => f.name);
    const suggestions = findSimilarFunctions(unknownField, fieldNames);
    
    if (suggestions.length > 0) {
        const suggestionText = suggestions.map(s => {
            const field = availableFields.find(f => f.name === s.name);
            return field ? `  - ${s.name}: ${field.type}` : `  - ${s.name}`;
        }).join('\n');
        
        throwCompilationError(
            `Field '${unknownField}' not found in type '${typeName}'. Did you mean:\n${suggestionText}`,
            location
        );
    } else {
        throwCompilationError(
            `Field '${unknownField}' not found in type '${typeName}'`,
            location
        );
    }
}

/**
 * Throw a compilation error with method suggestions when a method is not found
 * @param unknownMethod The unknown/misspelled method name
 * @param availableMethods Array of available method names
 * @param typeName Name of the type containing the methods
 * @param location Source location for the error
 */
export function throwMethodNotFoundWithSuggestions(
    unknownMethod: string,
    availableMethods: string[],
    typeName: string,
    location: SrcInfo
): never {
    const suggestions = findSimilarFunctions(unknownMethod, availableMethods);
    
    if (suggestions.length > 0) {
        const suggestionText = suggestions.map(s => `  - ${s.name}()`).join('\n');
        
        throwCompilationError(
            `Method '${unknownMethod}' not found in type '${typeName}'. Did you mean:\n${suggestionText}`,
            location
        );
    } else {
        throwCompilationError(
            `Method '${unknownMethod}' not found in type '${typeName}'`,
            location
        );
    }
}

/**
 * Get available stdlib import paths from the stdlib files
 */
function getAvailableStdlibImports(): string[] {
    return Object.keys(files)
        .filter(path => {
            // Support .tact, .fc (FunC), and .fif (Fift) files from libs and std directories
            return (path.startsWith("libs/") || path.startsWith("std/")) && 
                   (path.endsWith(".tact") || path.endsWith(".fc") || path.endsWith(".fif"));
        })
        .map(path => {
            // Remove libs/ or std/ prefix and keep the full filename with extension
            if (path.startsWith("libs/")) {
                return "@stdlib/" + path.slice("libs/".length);
            } else {
                return "@stdlib/" + path.slice("std/".length);
            }
        });
}

/**
 * Throw a compilation error with import suggestions when an import is not found
 * @param unknownImport The unknown/misspelled import path
 * @param importType Type of import ("stdlib" or "relative") 
 * @param location Source location for the error
 * @param availableFiles Optional list of available file paths for relative imports
 */
export function throwImportNotFoundWithSuggestions(
    unknownImport: string,
    importType: "stdlib" | "relative",
    location: SrcInfo,
    availableFiles?: string[]
): never {
    if (importType === "stdlib") {
        const availableImports = getAvailableStdlibImports();
        const suggestions = findSimilarFunctions(unknownImport, availableImports);
        
        if (suggestions.length > 0) {
            const suggestionText = suggestions.map(s => `  - ${s.name}`).join('\n');
            
            throwCompilationError(
                `Could not resolve import "${unknownImport}". Did you mean:\n${suggestionText}`,
                location
            );
        } else {
            throwCompilationError(
                `Could not resolve import "${unknownImport}"`,
                location
            );
        }
    } else if (importType === "relative" && availableFiles && availableFiles.length > 0) {
        const suggestions = findSimilarFunctions(unknownImport, availableFiles);
        
        if (suggestions.length > 0) {
            const suggestionText = suggestions.map(s => `  - ${s.name}`).join('\n');
            
            throwCompilationError(
                `Could not resolve import "${unknownImport}". Did you mean:\n${suggestionText}`,
                location
            );
        } else {
            throwCompilationError(
                `Could not resolve import "${unknownImport}"`,
                location
            );
        }
    } else {
        throwCompilationError(
            `Could not resolve import "${unknownImport}"`,
            location
        );
    }
}