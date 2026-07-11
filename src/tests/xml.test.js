import { generateXML } from "../services/xml.js";
import { formatXML, beautifyXML, compactXML, minifyXML } from "../services/xmlFormatter.js";

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

console.log("\nxml.test.js");

test("generateXML with full state", () => {
    const xml = generateXML({
        role: { persona: "Expert", job: "analyze" },
        task: "Review this code",
        constraints: ["Be concise", "Use examples"],
        input: "{{code}}",
        output_format: "Markdown",
        variables: [{ name: "lang", value: "JS" }],
    });

    assert.ok(xml.includes("<role>"), "has role tag");
    assert.ok(xml.includes("Expert"), "has persona");
    assert.ok(xml.includes("analyze"), "has job");
    assert.ok(xml.includes("<task>"), "has task tag");
    assert.ok(xml.includes("Review this code"), "has task content");
    assert.ok(xml.includes("<constraints>"), "has constraints tag");
    assert.ok(xml.includes("Be concise"), "has constraint text");
    assert.ok(xml.includes("<input>"), "has input tag");
    assert.ok(xml.includes("<output_format>"), "has output_format tag");
});

test("generateXML with empty state", () => {
    const xml = generateXML({
        role: { persona: "", job: "" },
        task: "",
        constraints: [],
        input: "",
        output_format: "",
        variables: [],
    });

    assert.ok(xml.includes("<role>"), "has role tag");
    assert.ok(xml.includes("</role>"), "closes role");
    assert.ok(xml.includes("<task>"), "has task tag");
    assert.ok(xml.includes("</task>"), "closes task");
});

test("generateXML escapes special chars", () => {
    const xml = generateXML({
        role: { persona: "AT&T", job: "write <code>" },
        task: "use \"quotes\" & 'apos'",
        constraints: [],
        input: "",
        output_format: "",
        variables: [],
    });

    assert.ok(xml.includes("AT&amp;T"), "escapes & in persona");
    assert.ok(xml.includes("&lt;code&gt;"), "escapes <> in job");
    assert.ok(xml.includes("&quot;quotes&quot;"), "escapes quotes in task");
});

test("formatXML indents properly", () => {
    const flat = "<role><persona>Test</persona></role>";
    const formatted = formatXML(flat);
    assert.ok(formatted.includes("\n"), "adds newlines");
    assert.ok(formatted.includes("  ") || formatted.includes("    "), "adds indentation");
});

test("beautifyXML alias works", () => {
    const result = beautifyXML("<a><b>c</b></a>");
    assert.ok(result.length > 10, "beautify expands XML");
});

test("compactXML removes whitespace", () => {
    const result = compactXML("<a>\n  <b>c</b>\n</a>");
    assert.equal(result, "<a><b>c</b></a>", "compact removes whitespace");
});

test("minifyXML alias for compact", () => {
    const result = minifyXML("<a>\n  <b>c</b>\n</a>");
    assert.equal(result, "<a><b>c</b></a>", "minify removes whitespace");
});

console.log(`\n  Result: ${passed} passed, ${failed} failed\n`);
