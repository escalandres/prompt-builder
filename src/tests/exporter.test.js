import { buildTemplate } from "../services/templateExporter.js";

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

console.log("\nexporter.test.js");

const mockState = {
    role: { persona: "Dev", job: "Code" },
    task: "Build",
    constraints: ["fast"],
    input: "{{x}}",
    output_format: "md",
    variables: [{ name: "x", value: "1" }],
};

test("buildTemplate creates valid envelope", () => {
    const tpl = buildTemplate(mockState);
    assert.equal(tpl.version, "1.0.0", "has version");
    assert.equal(tpl.type, "prompt-template", "has type");
    assert.ok(tpl.metadata, "has metadata");
    assert.ok(tpl.metadata.id, "has id");
    assert.ok(tpl.metadata.createdAt, "has createdAt");
    assert.ok(tpl.metadata.updatedAt, "has updatedAt");
});

test("buildTemplate includes state", () => {
    const tpl = buildTemplate(mockState);
    assert.equal(tpl.state.role.persona, "Dev", "state preserved");
    assert.equal(tpl.state.task, "Build", "task preserved");
});

test("buildTemplate merges metadata", () => {
    const tpl = buildTemplate(mockState, {
        name: "My Template",
        author: "Test",
        tags: ["test"],
    });
    assert.equal(tpl.metadata.name, "My Template", "custom name");
    assert.equal(tpl.metadata.author, "Test", "custom author");
    assert.equal(tpl.metadata.tags[0], "test", "custom tags");
});

test("buildTemplate defaults name when empty", () => {
    const tpl = buildTemplate(mockState);
    assert.equal(tpl.metadata.name, "Untitled Prompt", "default name");
});

console.log(`\n  Result: ${passed} passed, ${failed} failed\n`);
