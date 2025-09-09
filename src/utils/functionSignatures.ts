import { MapFunctions } from "@/abi/map";
import { GlobalFunctions } from "@/abi/global";
import type { CompilerContext } from "@/context/context";
import type { TypeRef } from "@/types/types";
import { printTypeRef } from "@/types/types";
import type { AbiFunction } from "@/abi/AbiFunction";

/**
 * Generate function signature by trying to analyze the AbiFunction
 * This is a best-effort approach since we don't have access to full type information
 */
function generateSignatureFromAbiFunction(
    functionName: string,
    abiFunction: AbiFunction
): string {
    // Since we can't easily reverse-engineer the exact signature from the resolve method,
    // we'll just return the function name for now
    // In a real implementation, we might need to add metadata to AbiFunction
    return `${functionName}(...)`;
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
    const signatures = new Map<string, string>();
    
    for (const [name, abiFunction] of MapFunctions.entries()) {
        signatures.set(name, generateSignatureFromAbiFunction(name, abiFunction));
    }
    
    return signatures;
}

/**
 * Get global function signatures dynamically from GlobalFunctions
 */
export function getGlobalFunctionSignatures(): Map<string, string> {
    const signatures = new Map<string, string>();
    
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