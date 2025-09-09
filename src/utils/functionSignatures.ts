import { MapFunctions } from "@/abi/map";
import { GlobalFunctions } from "@/abi/global";
import { StructFunctions } from "@/abi/struct";
import { ContractFunctions } from "@/abi/contracts";
import type { CompilerContext } from "@/context/context";
import type { TypeRef } from "@/types/types";
import { printTypeRef } from "@/types/types";
import type { SrcInfo } from "@/grammar";

/**
 * Generate function signature for display in error messages
 */
function generateFunctionSignature(
    functionName: string,
    params: string[],
    returnType?: string
): string {
    const paramsStr = params.join(", ");
    if (returnType && returnType !== "void") {
        return `${functionName}(${paramsStr}): ${returnType}`;
    }
    return `${functionName}(${paramsStr})`;
}

/**
 * Get map function signatures with full parameter and return type information
 */
export function getMapFunctionSignatures(): Map<string, string> {
    const signatures = new Map<string, string>();
    
    signatures.set("set", "set(self: map<K, V>, key: K, val: V)");
    signatures.set("get", "get(self: map<K, V>, key: K): V?");
    signatures.set("del", "del(self: map<K, V>, key: K): Bool");
    signatures.set("exists", "exists(self: map<K, V>, key: K): Bool");
    signatures.set("isEmpty", "isEmpty(self: map<K, V>): Bool");
    signatures.set("asCell", "asCell(self: map<K, V>): Cell?");
    signatures.set("deepEquals", "deepEquals(self: map<K, V>, other: map<K, V>): Bool");
    signatures.set("replace", "replace(self: map<K, V>, key: K, val: V): Bool");
    signatures.set("replaceGet", "replaceGet(self: map<K, V>, key: K, val: V): V?");
    
    return signatures;
}

/**
 * Get comprehensive global function signatures - all known functions
 */
export function getGlobalFunctionSignatures(): Map<string, string> {
    const signatures = new Map<string, string>();
    
    // Core functions
    signatures.set("require", "require(condition: Bool, message: String)");
    signatures.set("dump", "dump(value: Any)");
    signatures.set("dumpStack", "dumpStack()");
    signatures.set("now", "now(): Int");
    
    // Type constructors
    signatures.set("address", "address(s: String): Address");  
    signatures.set("cell", "cell(s: String): Cell");
    signatures.set("slice", "slice(s: String): Slice");
    signatures.set("ton", "ton(coins: String): Int");
    
    // Builder/Cell functions
    signatures.set("beginString", "beginString(): StringBuilder");
    signatures.set("beginCell", "beginCell(): Builder");
    signatures.set("beginTailString", "beginTailString(): StringBuilder");
    signatures.set("emptyCell", "emptyCell(): Cell");
    signatures.set("emptySlice", "emptySlice(): Slice");
    signatures.set("emptyMap", "emptyMap(): map<K, V>?");
    
    // Contract functions
    signatures.set("contractAddress", "contractAddress(s: StateInit): Address");
    signatures.set("contractAddressExt", "contractAddressExt(chain: Int, code: Cell, data: Cell): Address");
    signatures.set("send", "send(params: SendParameters)");
    signatures.set("self", "self(): Address");
    signatures.set("sender", "sender(): Address");
    signatures.set("myBalance", "myBalance(): Int");
    signatures.set("myAddress", "myAddress(): Address");
    
    // Native functions
    signatures.set("nativeReserve", "nativeReserve(amount: Int, mode: Int)");
    signatures.set("nativeSendMessage", "nativeSendMessage(cell: Cell, mode: Int)");
    signatures.set("nativeRandomize", "nativeRandomize(seed: Int)");
    signatures.set("nativeRandomizeLt", "nativeRandomizeLt()");
    signatures.set("nativePrepareRandom", "nativePrepareRandom()");
    signatures.set("nativeRandom", "nativeRandom(): Int");
    signatures.set("nativeRandomInterval", "nativeRandomInterval(max: Int): Int");
    signatures.set("nativeThrowWhen", "nativeThrowWhen(condition: Int, code: Int)");
    signatures.set("nativeThrowUnless", "nativeThrowUnless(condition: Int, code: Int)");
    
    // Crypto functions
    signatures.set("sha256", "sha256(data: String | Slice): Int");
    signatures.set("keccak256", "keccak256(data: String | Slice): Int");
    signatures.set("checkSignature", "checkSignature(hash: Int, signature: Slice, public_key: Int): Bool");
    signatures.set("checkDataSignature", "checkDataSignature(data: Slice, signature: Slice, public_key: Int): Bool");
    
    // Math functions
    signatures.set("min", "min(a: Int, b: Int): Int");
    signatures.set("max", "max(a: Int, b: Int): Int");
    signatures.set("abs", "abs(a: Int): Int");
    signatures.set("pow", "pow(base: Int, exp: Int): Int");
    signatures.set("pow2", "pow2(exp: Int): Int");
    signatures.set("log2", "log2(num: Int): Int");
    signatures.set("sqrt", "sqrt(num: Int): Int");
    
    // Parsing functions  
    signatures.set("parseStdAddress", "parseStdAddress(address: Slice): Address");
    signatures.set("parseVarAddress", "parseVarAddress(address: Slice): Address");
    signatures.set("parseInt", "parseInt(str: String): Int?");
    
    // Raw slice functions
    signatures.set("rawSlice", "rawSlice(data: String): Slice");
    signatures.set("ascii", "ascii(str: String): Int");
    
    return signatures;
}

/**
 * Get struct function signatures
 */
export function getStructFunctionSignatures(): Map<string, string> {
    const signatures = new Map<string, string>();
    
    signatures.set("toCell", "toCell(self: Struct): Cell");
    signatures.set("fromCell", "fromCell(cell: Cell): Struct");
    signatures.set("toString", "toString(self: Struct): String");
    
    return signatures;
}

/**
 * Get contract function signatures
 */
export function getContractFunctionSignatures(): Map<string, string> {
    const signatures = new Map<string, string>();
    
    signatures.set("storageReserve", "storageReserve(self: Contract): Int");
    
    return signatures;
}

/**
 * Get function signature for a specific function type
 */
export function getFunctionSignature(
    functionName: string,
    functionType: "map" | "global" | "struct" | "contract"
): string | undefined {
    switch (functionType) {
        case "map":
            return getMapFunctionSignatures().get(functionName);
        case "global":
            return getGlobalFunctionSignatures().get(functionName);
        case "struct":
            return getStructFunctionSignatures().get(functionName);
        case "contract":
            return getContractFunctionSignatures().get(functionName);
        default:
            return undefined;
    }
}