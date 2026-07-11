import { INDENT_SIZES } from "./constants.js";

export const DEFAULT_PROMPT_STATE = {
    role: {
        persona: "",
        job: "",
    },
    task: "",
    constraints: [],
    input: "{{input}}",
    output_format: "",
    variables: [],
};

export const DEFAULT_SETTINGS = {
    defaultPersona: "",
    defaultJob: "",
    defaultTask: "",
    defaultOutputFormat: "",
    indentSize: INDENT_SIZES[0],
    autoPreview: true,
    theme: "dark",
    compactMode: false,
    fontSize: "14px",
    language: "en",
};
