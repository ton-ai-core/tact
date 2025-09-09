import { itShouldNotCompile } from "@/test/compilation-failed/util";

describe("Function suggestions compilation errors", () => {
    describe("Map function suggestions", () => {
        itShouldNotCompile({
            testName: "map-function-s1et-typo", 
            errorMessage: 'Map function "s1et" not found. Did you mean:'
        });

        itShouldNotCompile({
            testName: "map-function-g3t-typo",
            errorMessage: 'Map function "g3t" not found. Did you mean:'
        });

        itShouldNotCompile({
            testName: "map-function-exsts-typo",
            errorMessage: 'Map function "exsts" not found. Did you mean:'
        });

        itShouldNotCompile({
            testName: "map-function-d3l-typo",
            errorMessage: 'Map function "d3l" not found. Did you mean:'
        });

        itShouldNotCompile({
            testName: "map-function-isEmty-typo",
            errorMessage: 'Map function "isEmty" not found. Did you mean:'
        });
    });

    describe("Global function suggestions", () => {
        itShouldNotCompile({
            testName: "global-function-reqire-typo",
            errorMessage: 'Global function "reqire" not found. Did you mean:'
        });

        itShouldNotCompile({
            testName: "global-function-emptyMp-typo", 
            errorMessage: 'Global function "emptyMp" not found. Did you mean:'
        });

        itShouldNotCompile({
            testName: "global-function-dmp-typo",
            errorMessage: 'Global function "dmp" not found. Did you mean:'
        });

        itShouldNotCompile({
            testName: "global-function-nw-typo",
            errorMessage: 'Global function "nw" not found'
        });

        itShouldNotCompile({
            testName: "global-function-addres-typo",
            errorMessage: 'Global function "addres" not found. Did you mean:'
        });
    });

    describe("Error fallback cases", () => {
        itShouldNotCompile({
            testName: "map-function-no-suggestions",
            errorMessage: 'Map function "completelyDifferentName" not found'
        });
    });

    describe("Field suggestions", () => {
        itShouldNotCompile({
            testName: "struct-field-typo",
            errorMessage: 'Field \'x1\' not found in type \'Point\'. Did you mean:'
        });

        itShouldNotCompile({
            testName: "complex-struct-field-typo",
            errorMessage: 'Field \'intValu3\' not found in type \'ComplexStruct\'. Did you mean:'
        });
    });

    describe("Method suggestions", () => {
        itShouldNotCompile({
            testName: "contract-method-typo",
            errorMessage: 'Function in type "Test" "incremen1" not found. Did you mean:'
        });


    });

    describe("Import suggestions", () => {
        itShouldNotCompile({
            testName: "import-typo",
            errorMessage: 'Could not resolve import "@stdlib/deploy1.tact". Did you mean:'
        });

        itShouldNotCompile({
            testName: "file-import-typo",
            errorMessage: 'Could not resolve import "helper_typo.tact". Did you mean:'
        });

        itShouldNotCompile({
            testName: "multiple-files-import-test",
            errorMessage: 'Could not resolve import "utls.tact". Did you mean:'
        });

        itShouldNotCompile({
            testName: "func-import-test",
            errorMessage: 'Could not resolve import "dns_typo.fc". Did you mean:'
        });


        itShouldNotCompile({
            testName: "stdlib-fc-import-test",
            errorMessage: 'Could not resolve import "@stdlib/dns_typo.fc". Did you mean:'
        });
    });
});