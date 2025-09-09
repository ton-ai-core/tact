import { readFileSync } from "fs";
import { run } from "@/cli/tact";
import { Logger, LogLevel } from "@/context/logger";
import * as Stdlib from "@/stdlib/stdlib";
import { createVirtualFileSystem } from "@/vfs/createVirtualFileSystem";
import { join } from "path";
import type { Options } from "@/config/parseConfig";

// helper to reduce boilerplate
export function itShouldNotCompile(params: {
    testName: string;
    errorMessage: string;
}) {
    it(`should not compile ${params.testName}`, async () => {
        const fileName = `${params.testName}.tact`;
        const options: Options = params.testName.includes("external")
            ? {
                  external: true,
              }
            : {};

        // For file import tests, add helper files
        const files: Record<string, string> = {
            [fileName]: readFileSync(
                join(__dirname, "contracts", `./${fileName}`),
            ).toString("base64"),
        };
        
        if (params.testName === "file-import-typo") {
            files["helper.tact"] = readFileSync(
                join(__dirname, "contracts", "./helper.tact"),
            ).toString("base64");
        }
        
        if (params.testName === "multiple-files-import-test") {
            files["helper.tact"] = readFileSync(
                join(__dirname, "contracts", "./helper.tact"),
            ).toString("base64");
            files["utils.tact"] = readFileSync(
                join(__dirname, "contracts", "./utils.tact"),
            ).toString("base64");
            files["lib.tact"] = readFileSync(
                join(__dirname, "contracts", "./lib.tact"),
            ).toString("base64");
        }
        
        if (params.testName === "func-import-test") {
            files["dns.fc"] = readFileSync(
                join(__dirname, "contracts", "./dns.fc"),
            ).toString("base64");
        }
        
        if (params.testName === "fif-import-test") {
            files["test.fif"] = readFileSync(
                join(__dirname, "contracts", "./test.fif"),
            ).toString("base64");
        }

        const result = await run({
            config: {
                projects: [
                    {
                        name: params.testName,
                        path: `./${fileName}`,
                        output: "./output",
                        options,
                    },
                ],
            },
            logger: new Logger(LogLevel.NONE),
            project: createVirtualFileSystem(
                "/",
                files,
                false,
            ),
            stdlib: createVirtualFileSystem("@stdlib", Stdlib.files),
        });

        expect(result.ok).toBe(false);

        const message = result.error.map((err) => err.message).join("; ");
        expect(message).toContain(params.errorMessage);
    });
}
