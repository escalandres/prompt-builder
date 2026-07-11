import { templates, getTemplateKeys, getTemplate } from "../templates.js";

const assert = {
    ok(val, msg) { if (!val) throw new Error(`FAIL: ${msg}`); },
    equal(a, b, msg) { if (a !== b) throw new Error(`FAIL: ${msg} — expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`); },
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

console.log("\ntemplates.test.js");

test("templates has 3 presets", () => {
    const keys = Object.keys(templates);
    assert.equal(keys.length, 3, "should have 3 templates");
});

test("each template has name and description", () => {
    Object.values(templates).forEach((tmpl) => {
        assert.ok(typeof tmpl.name === "string" && tmpl.name.length > 0, `template ${tmpl.name} has name`);
        assert.ok(typeof tmpl.description === "string", `template ${tmpl.name} has description`);
        assert.ok(tmpl.structure && typeof tmpl.structure === "object", `template ${tmpl.name} has structure`);
    });
});

test("basic template structure has required fields", () => {
    const s = templates.basic.structure;
    assert.ok("role" in s, "basic has role");
    assert.ok("task" in s, "basic has task");
    assert.ok("constraints" in s, "basic has constraints");
    assert.ok("input" in s, "basic has input");
});

test("getTemplateKeys returns keys", () => {
    const keys = getTemplateKeys();
    assert.ok(Array.isArray(keys), "returns array");
    assert.ok(keys.includes("basic"), "includes basic");
    assert.ok(keys.includes("advanced"), "includes advanced");
});

test("getTemplate returns template by name", () => {
    const tmpl = getTemplate("basic");
    assert.ok(tmpl, "finds basic template");
    assert.equal(tmpl.name, "Basic Prompt", "correct name");
});

test("getTemplate returns null for unknown", () => {
    const tmpl = getTemplate("nonexistent");
    assert.equal(tmpl, null, "returns null");
});

console.log(`\n  Result: ${passed} passed, ${failed} failed\n`);
