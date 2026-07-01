// templateValidator.js

function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isString(value) {
    return typeof value === "string";
}

export function validateTemplate(template) {
    if (!isObject(template)) {
        throw new Error("Invalid template: root object is required.");
    }

    if (!isString(template.version) || template.version.trim() === "") {
        throw new Error("Invalid template: missing version.");
    }

    if (template.type !== "prompt-template") {
        throw new Error("Invalid template type.");
    }

    validateMetadata(template.metadata);
    validateState(template.state);

    return true;
}

function validateMetadata(metadata) {
    if (!isObject(metadata)) {
        throw new Error("Invalid metadata.");
    }

    const requiredFields = [
        "id",
        "name",
        "description",
        "author",
        "createdAt",
        "updatedAt"
    ];

    for (const field of requiredFields) {
        if (!isString(metadata[field])) {
            throw new Error(`Metadata field "${field}" is required.`);
        }
    }

    if (
        metadata.tags !== undefined &&
        !Array.isArray(metadata.tags)
    ) {
        throw new Error("Metadata.tags must be an array.");
    }
}

function validateState(state) {
    if (!isObject(state)) {
        throw new Error("State is required.");
    }

    validateRole(state.role);

    if (!isString(state.task)) {
        throw new Error("Task must be a string.");
    }

    if (!Array.isArray(state.constraints)) {
        throw new Error("Constraints must be an array.");
    }

    for (const constraint of state.constraints) {
        if (!isString(constraint)) {
            throw new Error("Each constraint must be a string.");
        }
    }

    if (!isString(state.input)) {
        throw new Error("Input must be a string.");
    }

    if (!isString(state.output_format)) {
        throw new Error("Output format must be a string.");
    }

    if (
        state.variables !== undefined &&
        !isObject(state.variables)
    ) {
        throw new Error("Variables must be an object.");
    }

    if (state.variables) {
        for (const [key, value] of Object.entries(state.variables)) {
            if (!isString(key) || !isString(value)) {
                throw new Error("Variables must contain string keys and values.");
            }
        }
    }
}

function validateRole(role) {
    if (!isObject(role)) {
        throw new Error("Role is required.");
    }

    if (!isString(role.persona)) {
        throw new Error("Role.persona must be a string.");
    }

    if (!isString(role.job)) {
        throw new Error("Role.job must be a string.");
    }
}