// templateImporter.js

import { validateTemplate } from "./templateValidator.js";

export async function importTemplate(file) {
    if (!(file instanceof File)) {
        throw new Error("A valid template file is required.");
    }

    const content = await file.text();

    let template;

    try {
        template = JSON.parse(content);
    } catch {
        throw new Error("The selected file is not valid JSON.");
    }

    validateTemplate(template);

    return structuredClone(template);
}

export async function importTemplateFromInput(input) {
    if (!(input instanceof HTMLInputElement)) {
        throw new Error("A valid file input is required.");
    }

    const file = input.files?.[0];

    if (!file) {
        throw new Error("No template file selected.");
    }

    return importTemplate(file);
}

export function extractState(template) {
    validateTemplate(template);

    return structuredClone(template.state);
}

export function extractMetadata(template) {
    validateTemplate(template);

    return structuredClone(template.metadata);
}