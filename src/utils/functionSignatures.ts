import { MapFunctions } from "@/abi/map";
import { GlobalFunctions } from "@/abi/global";
import type { AbiFunction } from "@/abi/AbiFunction";

/**
 * Try to generate function signature based on existence in compiler functions
 * Only returns signatures for functions that actually exist in the compiler
 */
function generateSignatureFromAbiFunction(
    functionName: string,
    _abiFunction: AbiFunction
): string {
    // We only provide signatures for functions that actually exist in the compiler
    // This ensures we stay in sync with the real implementation
    
    // Map functions - only if they exist in MapFunctions
    if (MapFunctions.has(functionName)) {
        switch (functionName) {
            case "set": return "set(self: map<K, V>, key: K, value: V)";
            case "get": return "get(self: map<K, V>, key: K): V?";
            case "del": return "del(self: map<K, V>, key: K): Bool";
            case "exists": return "exists(self: map<K, V>, key: K): Bool";
            case "isEmpty": return "isEmpty(self: map<K, V>): Bool";
            case "asCell": return "asCell(self: map<K, V>): Cell?";
            case "deepEquals": return "deepEquals(self: map<K, V>, other: map<K, V>): Bool";
            case "replace": return "replace(self: map<K, V>, key: K, value: V): Bool";
            case "replaceGet": return "replaceGet(self: map<K, V>, key: K, value: V): V?";
            default: return functionName; // Fallback for any new map functions
        }
    }
    
    // Global functions - only if they exist in GlobalFunctions
    if (GlobalFunctions.has(functionName)) {
        switch (functionName) {
            case "require": return "require(condition: Bool, message: String)";
            case "ton": return "ton(coins: String): Int";
            case "dump": return "dump(value: Any)";
            case "dumpStack": return "dumpStack()";
            case "now": return "now(): Int";
            case "address": return "address(s: String): Address";
            case "cell": return "cell(s: String): Cell";
            case "slice": return "slice(s: String): Slice";
            case "emptyMap": return "emptyMap(): map<K, V>?";
            case "emptyCell": return "emptyCell(): Cell";
            case "emptySlice": return "emptySlice(): Slice";
            case "beginCell": return "beginCell(): Builder";
            case "beginString": return "beginString(): StringBuilder";
            case "beginTailString": return "beginTailString(): StringBuilder";
            default: return functionName; // Fallback for any new global functions
        }
    }
    
    // If function doesn't exist in compiler, just return name
    return functionName;
}

/**
 * Get available map function names dynamically from MapFunctions
 */
export function getMapFunctionNames(): string[] {
    return Array.from(MapFunctions.keys());
}

/**
 * Get available global function names dynamically from GlobalFunctions  
 */
export function getGlobalFunctionNames(): string[] {
    return Array.from(GlobalFunctions.keys());
}

/**
 * Get map function signatures dynamically from MapFunctions
 */
export function getMapFunctionSignatures(): Map<string, string> {
    const signatures: Map<string, string> = new Map();
    
    for (const [name, abiFunction] of MapFunctions.entries()) {
        signatures.set(name, generateSignatureFromAbiFunction(name, abiFunction));
    }
    
    return signatures;
}

/**
 * Get global function signatures dynamically from GlobalFunctions
 */
export function getGlobalFunctionSignatures(): Map<string, string> {
    const signatures: Map<string, string> = new Map();
    
    for (const [name, abiFunction] of GlobalFunctions.entries()) {
        signatures.set(name, generateSignatureFromAbiFunction(name, abiFunction));
    }
    
    return signatures;
}

/**
 * Get function signature for a specific function type
 */
export function getFunctionSignature(
    functionName: string,
    functionType: "map" | "global"
): string | undefined {
    switch (functionType) {
        case "map":
            return getMapFunctionSignatures().get(functionName);
        case "global":
            return getGlobalFunctionSignatures().get(functionName);
        default:
            return undefined;
    }
}