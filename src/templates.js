// templates.js

export const templates = {
    basic: {
        name: "Basic Prompt",
        description: "Estructura simple de prompt con role, task e input",
        structure: {
            role: {
                persona: "",
                job: ""
            },
            task: "",
            constraints: [],
            input: "",
            output_format: ""
        }
    },

    advanced: {
        name: "Advanced Prompt",
        description: "Incluye variables y constraints estructuradas",
        structure: {
            role: {
                persona: "",
                job: ""
            },
            task: "",
            constraints: [
                {
                    id: 1,
                    text: ""
                }
            ],
            input: "",
            output_format: "",
            variables: {}
        }
    },

    structuredXml: {
        name: "Structured XML Prompt",
        description: "Optimizado para generación XML limpia",
        structure: {
            role: {
                persona: "",
                job: ""
            },
            task: "",
            constraints: [],
            input: "",
            output_format: "",
            metadata: {
                version: "1.0",
                language: "en"
            }
        }
    }
};

export function getTemplateKeys() {
    return Object.keys(templates);
}

export function getTemplate(name) {
    return templates[name] || null;
}