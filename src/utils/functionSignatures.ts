import { MapFunctions } from "@/abi/map";
import { GlobalFunctions } from "@/abi/global";

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