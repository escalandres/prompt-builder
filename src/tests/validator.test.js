import { validateTemplate, isValidTemplate, getTemplateErrors } from "../services/templateValidator.js";

const assert = {
    ok(val, msg) { if (!val) throw new Error(`FAIL: ${msg}`); },
    equal(a, b, msg) { if (a !== b) throw new Error(`FAIL: ${msg} — expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); },
    deepEqual(a, b, msg) { if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`FAIL: ${msg}`); },
};

let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        passed++;
        console.log(`  ✓ ${name}`);
    } catch (e) {
        failed++;
        console.log(`  ✗ ${name}: ${e.message}`);
    }
}

console.log("\nvalidator.test.js");

test("validates a correct template", () => {
    const result = validateTemplate({
        role: { persona: "dev", job: "code" },
        task: "write code",
        constraints: [],
        input: "{{input}}",
        output_format: "markdown",
        variables: [],
    });
    assert.ok(result.valid, "should be valid");
});

test("rejects null template", () => {
    const result = validateTemplate(null);
    assert.ok(!result.valid, "should be invalid");
    assert.ok(result.errors.length > 0, "should have errors");
});

test("detects missing role", () => {
    const result = validateTemplate({
        task: "x",
        constraints: [],
        input: "",
        output_format: "",
        variables: [],
    });
    assert.ok(!result.valid, "should be invalid");
    assert.ok(result.errors.some(e => e.includes("role")), "should mention role");
});

test("detects invalid role type", () => {
    const result = validateTemplate({
        role: "not-an-object",
        task: "x",
        constraints: [],
        input: "",
        output_format: "",
        variables: [],
    });
    assert.ok(!result.valid, "should be invalid");
});

test("detects invalid constraints type", () => {
    const result = validateTemplate({
        role: { persona: "a", job: "b" },
        task: "x",
        constraints: "not-an-array",
        input: "",
        output_format: "",
        variables: [],
    });
    assert.ok(!result.valid, "should be invalid");
});

test("detects invalid variables type", () => {
    const result = validateTemplate({
        role: { persona: "a", job: "b" },
        task: "x",
        constraints: [],
        input: "",
        output_format: "",
        variables: "not-an-array",
    });
    assert.ok(!result.valid, "should be invalid");
});

test("isValidTemplate returns boolean", () => {
    assert.ok(isValidTemplate({
        role: { persona: "a", job: "b" },
        task: "x",
        constraints: [],
        input: "",
        output_format: "",
        variables: [],
    }), "valid template");

    assert.ok(!isValidTemplate(null), "null template");
});

test("getTemplateErrors returns array", () => {
    const errors = getTemplateErrors(null);
    assert.ok(Array.isArray(errors), "should be array");
    assert.ok(errors.length > 0, "should have errors");
});

console.log(`\n  Result: ${passed} passed, ${failed} failed\n`);
