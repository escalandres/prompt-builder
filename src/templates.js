// templates.js

export const templates = {
    basic: {
        name: "Basic Prompt",
        description: "Simple: role, task and input",
        structure: {
            role: {
                persona: "Expert Assistant",
                job: "provide clear and accurate responses"
            },
            task: "Answer the following question based on your knowledge.",
            constraints: [],
            input: "{{question}}",
            output_format: ""
        }
    },

    advanced: {
        name: "Advanced Prompt",
        description: "Includes constraints, output format and variables",
        structure: {
            role: {
                persona: "Senior Software Architect",
                job: "design and review system architecture"
            },
            task: "Analyze the following requirements and propose a software architecture.",
            constraints: [
                "Use only well-established patterns",
                "Include a clear separation of concerns",
                "Justify every major decision"
            ],
            input: "{{requirements}}",
            output_format: "Markdown with headings, diagrams in Mermaid",
            variables: {}
        }
    },

    structuredXml: {
        name: "Structured XML Prompt",
        description: "Optimized for clean XML generation",
        structure: {
            role: {
                persona: "Code Reviewer",
                job: "review source code for bugs, security issues and best practices"
            },
            task: "Review the provided source code. List all issues found, classify them by severity, and suggest fixes.",
            constraints: [
                "Be specific — reference exact lines",
                "Prioritize security over style",
                "Suggest concrete code changes"
            ],
            input: "{{source_code}}",
            output_format: "XML with <issue severity=\"high|medium|low\"> blocks"
        }
    }
};

export function getTemplateKeys() {
    return Object.keys(templates);
}

export function getTemplate(name) {
    return templates[name] || null;
}