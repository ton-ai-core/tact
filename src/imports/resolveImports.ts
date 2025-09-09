import type { Parser } from "@/grammar";
import type { VirtualFileSystem } from "@/vfs/VirtualFileSystem";
import { throwCompilationError } from "@/error/errors";
import { throwImportNotFoundWithSuggestions } from "@/utils/errorSuggestions";
import { resolveLibrary } from "@/imports/resolveLibrary";
import { asString } from "@/imports/path";
import type { Language, Source } from "@/imports/source";

/**
 * Calculate relative path from source file to target file
 */
function getRelativePath(fromPath: string, toPath: string, rootPath: string): string | null {
    try {
        // Remove root path from both paths
        const from = fromPath.slice(rootPath.length);
        const to = toPath.slice(rootPath.length);
        
        // Get directories
        const fromDir = from.replace(/[^/]*$/, "");
        const toFile = to;
        
        // If in same directory, return "./" + filename
        if (fromDir === toFile.replace(/[^/]*$/, "")) {
            const filename = toFile.split("/").pop();
            return filename ? `./${filename}` : null;
        }
        
        // For now, only suggest files in same directory
        // Could extend to handle ../path later
        return null;
    } catch {
        return null;
    }
}

type ResolveImportsArgs = {
    readonly entrypoint: string;
    readonly project: VirtualFileSystem;
    readonly stdlib: VirtualFileSystem;
    readonly parser: Parser;
};

export function resolveImports({
    entrypoint,
    parser,
    project,
    stdlib,
}: ResolveImportsArgs) {
    const imported: Record<Language, Map<string, Source>> = {
        func: new Map(),
        tact: new Map(),
    };
    const processed: Set<string> = new Set();
    const pending: Source[] = [];
    function processImports(sourceFrom: Source) {
        const imp = parser.parseImports(sourceFrom);
        for (const { importPath, loc } of imp) {
            // Resolve library
            const resolved = resolveLibrary({
                sourceFrom,
                importPath,
                project: project,
                stdlib: stdlib,
            });
            if (!resolved.ok) {
                const importType = importPath.type === "stdlib" ? "stdlib" : "relative";
                const importPathStr = importPath.type === "stdlib" 
                    ? `@stdlib/${asString(importPath.path)}` 
                    : asString(importPath.path);
                
                let availableFiles: string[] | undefined;
                if (importType === "relative") {
                    // For relative imports, try common file patterns
                    const vfs = sourceFrom.origin === "stdlib" ? stdlib : project;
                    const sourceDir = sourceFrom.path.slice(vfs.root.length).replace(/[^/]*$/, "");
                    
                    // Common file patterns to check (both .tact, .fc, .fif files)
                    const commonPatterns = [
                        "helper.tact", "helper.fc", "helper.fif",
                        "utils.tact", "utils.fc", "utils.fif", 
                        "common.tact", "common.fc", "common.fif",
                        "lib.tact", "lib.fc", "lib.fif",
                        "types.tact", "types.fc", "types.fif",
                        "interfaces.tact", "interfaces.fc", "interfaces.fif",
                        "stdlib.tact", "stdlib.fc", "stdlib.fif",
                        "dns.tact", "dns.fc", "dns.fif"
                    ];
                    
                    availableFiles = commonPatterns
                        .filter(pattern => {
                            try {
                                const fullPath = vfs.resolve(sourceDir, pattern);
                                return vfs.exists(fullPath);
                            } catch {
                                return false;
                            }
                        })
                        .map(file => `./${file}`);
                }
                
                throwImportNotFoundWithSuggestions(
                    importPathStr,
                    importType,
                    loc,
                    availableFiles
                );
            }

            // Check if already imported
            if (imported[resolved.language].has(resolved.path)) {
                continue;
            }

            // Load code
            const vfs = resolved.origin === "user" ? project : stdlib;
            if (!vfs.exists(resolved.path)) {
                throwCompilationError(
                    `Could not find source file ${resolved.path}`,
                );
            }
            const code: string = vfs.readFile(resolved.path).toString();

            // Add to imports
            if (resolved.language === "func") {
                imported.func.set(resolved.path, {
                    code,
                    path: resolved.path,
                    origin: resolved.origin,
                });
            } else {
                if (!processed.has(resolved.path)) {
                    processed.add(resolved.path);
                    pending.push({
                        path: resolved.path,
                        code,
                        origin: resolved.origin,
                    });
                }
            }
        }
    }

    const stdlibTactPath = stdlib.resolve("std/stdlib.tact");
    if (!stdlib.exists(stdlibTactPath)) {
        throwCompilationError(
            `Could not find stdlib.tact at ${stdlibTactPath}`,
        );
    }
    const stdlibSource: Source = {
        code: stdlib.readFile(stdlibTactPath).toString(),
        path: stdlibTactPath,
        origin: "stdlib",
    };
    imported.tact.set(stdlibTactPath, stdlibSource);
    processImports(stdlibSource);

    const codePath = project.resolve(entrypoint);
    if (!project.exists(codePath)) {
        throwCompilationError(`Could not find entrypoint file ${entrypoint}`);
    }
    const entrySource: Source = {
        code: project.readFile(codePath).toString(),
        path: codePath,
        origin: "user",
    };
    processImports(entrySource);

    while (pending.length > 0) {
        const p = pending.shift()!;
        imported.tact.set(p.path, p);
        processImports(p);
    }

    imported.tact.set(codePath, entrySource);

    return {
        tact: [...imported.tact.values()],
        func: [...imported.func.values()],
    };
}
