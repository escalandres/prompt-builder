// xml.js

function escapeXml(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function formatConstraints(constraints = []) {
    if (!constraints.length) return "";

    const items = constraints
        .map(c => {
            const text = typeof c === "string" ? c : c.text;
            return `    - ${escapeXml(text)}`;
        })
        .join("\n");

    return `<constraints>\n${items}\n</constraints>`;
}

function formatVariables(variables = []) {
    if (!variables.length) return "";

    const items = variables
        .filter(v => v.name && v.value)
        .map(v => `    <${escapeXml(v.name)}>${escapeXml(v.value)}</${escapeXml(v.name)}>`)
        .join("\n");

    return `<variables>\n${items}\n</variables>`;
}

export function generateXML(state) {
    const rolePersona = escapeXml(state?.role?.persona || "");
    const roleJob = escapeXml(state?.role?.job || "");
    const task = escapeXml(state?.task || "");
    const input = escapeXml(state?.input || "");
    const outputFormat = escapeXml(state?.output_format || "");

    const constraints = formatConstraints(state?.constraints || []);
    const variables = formatVariables(state?.variables || []);

    return [
        `<role>`,
        `You are a ${rolePersona}. Your job is to ${roleJob}.`,
        `</role>`,
        ``,
        `<task>`,
        `${task}`,
        `</task>`,
        ``,
        constraints,
        variables,
        ``,
        `<input>`,
        `${input}`,
        `</input>`,
        ``,
        `<output_format>`,
        `${outputFormat}`,
        `</output_format>`
    ]
        .filter(Boolean)
        .join("\n");
}