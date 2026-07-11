/**
 * Template Validator
 *
 * Valida la estructura de un template antes de:
 *
 * - Importarlo
 * - Exportarlo
 * - Guardarlo
 * - Compartirlo
 *
 * Este validador garantiza que cualquier template
 * tenga la estructura mínima requerida por la aplicación.
 */

const REQUIRED_FIELDS = [
    "role",
    "task",
    "constraints",
    "input",
    "output_format",
    "variables"
];

/* ---------------------------------------------------------- */
/* Validación principal                                        */
/* ---------------------------------------------------------- */

export function validateTemplate(template) {

    const errors = [];

    if (!template || typeof template !== "object") {

        return {
            valid: false,
            errors: [
                "Template must be an object."
            ]
        };

    }

    REQUIRED_FIELDS.forEach(field => {

        if (!(field in template)) {

            errors.push(
                `Missing required field: ${field}`
            );

        }

    });

    validateRole(
        template.role,
        errors
    );

    validateTask(
        template.task,
        errors
    );

    validateConstraints(
        template.constraints,
        errors
    );

    validateInput(
        template.input,
        errors
    );

    validateOutput(
        template.output_format,
        errors
    );

    validateVariables(
        template.variables,
        errors
    );

    return {

        valid: errors.length === 0,
        errors

    };

}

/* ---------------------------------------------------------- */

function validateRole(role, errors) {

    if (!role || typeof role !== "object") {

        errors.push(
            "role must be an object."
        );

        return;

    }

    if (typeof role.persona !== "string") {

        errors.push(
            "role.persona must be a string."
        );

    }

    if (typeof role.job !== "string") {

        errors.push(
            "role.job must be a string."
        );

    }

}

/* ---------------------------------------------------------- */

function validateTask(task, errors) {

    if (typeof task !== "string") {

        errors.push(
            "task must be a string."
        );

    }

}

/* ---------------------------------------------------------- */

function validateConstraints(list, errors) {

    if (!Array.isArray(list)) {

        errors.push(
            "constraints must be an array."
        );

        return;

    }

    list.forEach((item, index) => {

        if (typeof item !== "string") {

            errors.push(
                `constraints[${index}] must be a string.`
            );

        }

    });

}

/* ---------------------------------------------------------- */

function validateInput(input, errors) {

    if (typeof input !== "string") {

        errors.push(
            "input must be a string."
        );

    }

}

/* ---------------------------------------------------------- */

function validateOutput(output, errors) {

    if (typeof output !== "string") {

        errors.push(
            "output_format must be a string."
        );

    }

}

/* ---------------------------------------------------------- */

function validateVariables(variables, errors) {

    if (!Array.isArray(variables)) {

        errors.push(
            "variables must be an array."
        );

        return;

    }

    variables.forEach((variable, index) => {

        if (
            variable === null ||
            typeof variable !== "object"
        ) {

            errors.push(
                `variables[${index}] must be an object.`
            );

            return;

        }

        if (typeof variable.name !== "string") {

            errors.push(
                `variables[${index}].name must be a string.`
            );

        }

        if (typeof variable.value !== "string") {

            errors.push(
                `variables[${index}].value must be a string.`
            );

        }

    });

}

/* ---------------------------------------------------------- */
/* Lanza excepción si es inválido                              */
/* ---------------------------------------------------------- */

export function assertTemplate(template) {

    const result = validateTemplate(template);

    if (!result.valid) {

        throw new Error(
            result.errors.join("\n")
        );

    }

    return true;

}

/* ---------------------------------------------------------- */
/* Devuelve solamente los errores                              */
/* ---------------------------------------------------------- */

export function getTemplateErrors(template) {

    return validateTemplate(template).errors;

}

/* ---------------------------------------------------------- */
/* Verificación rápida                                          */
/* ---------------------------------------------------------- */

export function isValidTemplate(template) {

    return validateTemplate(template).valid;

}