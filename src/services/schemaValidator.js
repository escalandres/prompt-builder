/**
 * Schema Validator
 *
 * Valida el estado completo de la aplicación utilizando
 * un esquema declarativo.
 *
 * A diferencia de templateValidator, este archivo puede
 * validar cualquier objeto siguiendo un schema.
 */

/* ---------------------------------------------------------- */
/* Tipos soportados                                            */
/* ---------------------------------------------------------- */

const TYPES = {

    string: value =>
        typeof value === "string",

    number: value =>
        typeof value === "number" &&
        !Number.isNaN(value),

    boolean: value =>
        typeof value === "boolean",

    object: value =>
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value),

    array: value =>
        Array.isArray(value)

};

/* ---------------------------------------------------------- */
/* Schema Prompt Builder                                       */
/* ---------------------------------------------------------- */

export const promptSchema = {

    role: {

        type: "object",

        required: true,

        properties: {

            persona: {
                type: "string",
                required: true
            },

            job: {
                type: "string",
                required: true
            }

        }

    },

    task: {
        type: "string",
        required: true
    },

    constraints: {
        type: "array",
        required: true,
        items: {
            type: "string"
        }
    },

    input: {
        type: "string",
        required: true
    },

    output_format: {
        type: "string",
        required: true
    },

    variables: {

        type: "array",

        required: true,

        items: {

            type: "object",

            properties: {

                name: {
                    type: "string",
                    required: true
                },

                value: {
                    type: "string",
                    required: true
                }

            }

        }

    }

};

/* ---------------------------------------------------------- */
/* Validador principal                                         */
/* ---------------------------------------------------------- */

export function validateSchema(
    object,
    schema = promptSchema
) {

    const errors = [];

    validateObject(
        object,
        schema,
        "",
        errors
    );

    return {

        valid: errors.length === 0,
        errors

    };

}

/* ---------------------------------------------------------- */

function validateObject(
    object,
    schema,
    path,
    errors
) {

    Object.entries(schema).forEach(([key, rule]) => {

        const currentPath =
            path
                ? `${path}.${key}`
                : key;

        const value = object?.[key];

        if (
            rule.required &&
            value === undefined
        ) {

            errors.push(
                `${currentPath} is required.`
            );

            return;

        }

        if (value === undefined) {
            return;
        }

        validateValue(
            value,
            rule,
            currentPath,
            errors
        );

    });

}

/* ---------------------------------------------------------- */

function validateValue(
    value,
    rule,
    path,
    errors
) {

    const validator = TYPES[rule.type];

    if (!validator) {

        errors.push(
            `Unknown type "${rule.type}" at ${path}`
        );

        return;

    }

    if (!validator(value)) {

        errors.push(
            `${path} must be ${rule.type}.`
        );

        return;

    }

    if (rule.type === "object") {

        validateObject(

            value,

            rule.properties,

            path,

            errors

        );

    }

    if (rule.type === "array") {

        validateArray(

            value,

            rule.items,

            path,

            errors

        );

    }

}

/* ---------------------------------------------------------- */

function validateArray(
    array,
    itemRule,
    path,
    errors
) {

    array.forEach((item, index) => {

        const currentPath =
            `${path}[${index}]`;

        validateValue(

            item,

            itemRule,

            currentPath,

            errors

        );

    });

}

/* ---------------------------------------------------------- */
/* Helpers                                                     */
/* ---------------------------------------------------------- */

export function isValidSchema(
    object,
    schema = promptSchema
) {

    return validateSchema(
        object,
        schema
    ).valid;

}

export function getSchemaErrors(
    object,
    schema = promptSchema
) {

    return validateSchema(
        object,
        schema
    ).errors;

}

export function assertSchema(
    object,
    schema = promptSchema
) {

    const result = validateSchema(
        object,
        schema
    );

    if (!result.valid) {

        throw new Error(
            result.errors.join("\n")
        );

    }

    return true;

}