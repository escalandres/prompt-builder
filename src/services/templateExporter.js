// templateExporter.js

export function buildTemplate(state, metadata = {}) {
    const now = new Date().toISOString();

    return {
        version: "1.0.0",
        type: "prompt-template",
        metadata: {
            id: metadata.id || crypto.randomUUID(),
            name: metadata.name || "Untitled Prompt",
            description: metadata.description || "",
            author: metadata.author || "",
            createdAt: metadata.createdAt || now,
            updatedAt: now,
            tags: Array.isArray(metadata.tags) ? metadata.tags : []
        },
        state: structuredClone(state)
    };
}

export function downloadTemplate(template) {
    const filename = buildFilename(template);

    const json = JSON.stringify(template, null, 4);

    const blob = new Blob(
        [json],
        {
            type: "application/json;charset=utf-8"
        }
    );

    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = filename;

    document.body.appendChild(anchor);

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(url);
}

export function exportTemplate(state, metadata = {}) {
    const template = buildTemplate(state, metadata);

    downloadTemplate(template);

    return template;
}

function buildFilename(template) {
    const name = sanitizeFilename(template.metadata.name);

    return `${name}.prompt.json`;
}

function sanitizeFilename(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-_]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "prompt-template";
}