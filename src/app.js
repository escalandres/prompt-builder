import { stateManager } from "./core/stateManager.js";
import { createRenderer } from "./core/renderer.js";
import { createEventBinder } from "./core/eventBinder.js";
import { settingsManager } from "./config/settings.js";
import { createSettingsPanel, applyTheme } from "./ui/settingsPanel.js";
import { setLanguage } from "./i18n/index.js";

document.addEventListener("DOMContentLoaded", init);

function init() {

    const elements = {
        persona: document.getElementById("persona"),
        job: document.getElementById("job"),
        task: document.getElementById("task"),
        input: document.getElementById("input-placeholder"),
        output: document.getElementById("output-format"),
        constraintsList: document.getElementById("constraints-list"),
        variablesList: document.getElementById("variables-list"),
        copy: document.getElementById("copy-btn"),
        download: document.getElementById("download-btn"),
        addConstraint: document.getElementById("add-constraint"),
        addVariable: document.getElementById("add-variable"),
        exportTemplate: document.getElementById("export-template-btn"),
        importTemplate: document.getElementById("import-template-btn"),
        preview: document.getElementById("xml-preview"),
        beautify: document.getElementById("beautify-btn"),
    };

    const s = settingsManager.get();

    applyTheme(s.theme);
    setLanguage(s.language);
    applyCompactMode(s.compactMode);
    applyFontSize(s.fontSize);

    applySettingsDefaults();

    const renderer = createRenderer(elements);

    createEventBinder(elements, renderer);

    stateManager.subscribe(renderer.render);

    renderer.render(stateManager.getState());

    createSettingsPanel();

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        const current = settingsManager.get().theme;
        if (current === "system") applyTheme("system");
    });
}

function applySettingsDefaults() {
    const s = settingsManager.get();
    const persona = document.getElementById("persona");
    const job = document.getElementById("job");
    const task = document.getElementById("task");
    const output = document.getElementById("output-format");

    if (s.defaultPersona && !persona.value) {
        persona.value = s.defaultPersona;
        stateManager.update("role.persona", s.defaultPersona);
    }
    if (s.defaultJob && !job.value) {
        job.value = s.defaultJob;
        stateManager.update("role.job", s.defaultJob);
    }
    if (s.defaultTask && !task.value) {
        task.value = s.defaultTask;
        stateManager.update("task", s.defaultTask);
    }
    if (s.defaultOutputFormat && !output.value) {
        output.value = s.defaultOutputFormat;
        stateManager.update("output_format", s.defaultOutputFormat);
    }
}

function applyCompactMode(enabled) {
    document.documentElement.classList.toggle("compact", enabled);
}

function applyFontSize(size) {
    document.documentElement.style.setProperty("--app-font-size", size);
}
