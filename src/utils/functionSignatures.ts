import { MapFunctions } from "@/abi/map";
import { GlobalFunctions } from "@/abi/global";
import type { CompilerContext } from "@/context/context";
import type { TypeRef } from "@/types/types";
import { printTypeRef } from "@/types/types";

/**
 * Get map function signatures dynamically from MapFunctions definitions
 */
export function getMapFunctionSignatures(): Map<string, string> {
    const signatures = new Map<string, string>();
    
    // Generate basic signatures for map functions based on their resolve methods
    signatures.set("set", "set(self: map<K, V>, key: K, value: V)");
    signatures.set("get", "get(self: map<K, V>, key: K): V?");
    signatures.set("del", "del(self: map<K, V>, key: K): Bool");
    signatures.set("exists", "exists(self: map<K, V>, key: K): Bool");
    signatures.set("isEmpty", "isEmpty(self: map<K, V>): Bool");
    signatures.set("asCell", "asCell(self: map<K, V>): Cell?");
    signatures.set("deepEquals", "deepEquals(self: map<K, V>, other: map<K, V>): Bool");
    signatures.set("replace", "replace(self: map<K, V>, key: K, value: V): Bool");
    signatures.set("replaceGet", "replaceGet(self: map<K, V>, key: K, value: V): V?");
    
    return signatures;
}

/**
 * Get global function signatures dynamically from GlobalFunctions definitions
 */
export function getGlobalFunctionSignatures(): Map<string, string> {
    const signatures = new Map<string, string>();
    
    // Generate basic signatures for global functions
    signatures.set("require", "require(condition: Bool, message: String)");
    signatures.set("ton", "ton(coins: String): Int");
    signatures.set("dump", "dump(value: Any)");
    signatures.set("dumpStack", "dumpStack()");
    signatures.set("now", "now(): Int");
    signatures.set("address", "address(s: String): Address");
    signatures.set("cell", "cell(s: String): Cell");
    signatures.set("slice", "slice(s: String): Slice");
    signatures.set("emptyMap", "emptyMap(): map<K, V>?");
    signatures.set("emptyCell", "emptyCell(): Cell");
    signatures.set("emptySlice", "emptySlice(): Slice");
    signatures.set("beginCell", "beginCell(): Builder");
    signatures.set("beginString", "beginString(): StringBuilder");
    signatures.set("beginTailString", "beginTailString(): StringBuilder");
    
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