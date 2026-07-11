import { storage } from "../services/storage.js";

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

console.log("\nstorage.test.js");

const testState = {
    role: { persona: "Test", job: "Testing" },
    task: "Run tests",
    constraints: [],
    input: "{{input}}",
    output_format: "text",
    variables: [],
};

test("saves and loads state", () => {
    storage.save(testState);
    const loaded = storage.load();
    assert.ok(loaded, "load returns data");
    assert.equal(loaded.role.persona, "Test", "persona matches");
    assert.equal(loaded.task, "Run tests", "task matches");
});

test("clear removes state", () => {
    storage.save(testState);
    storage.clear();
    const loaded = storage.load();
    assert.equal(loaded, null, "load returns null after clear");
});

test("load returns null on empty storage", () => {
    storage.clear();
    const loaded = storage.load();
    assert.equal(loaded, null, "null for empty");
});

console.log(`\n  Result: ${passed} passed, ${failed} failed\n`);
