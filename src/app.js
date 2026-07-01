import { stateManager } from "./core/stateManager.js";
import { createRenderer } from "./core/renderer.js";
import { generateXML } from "./services/xml.js";

import { exportTemplate } from "./services/templateExporter.js";
import {
    importTemplateFromInput,
    extractState
} from "./services/templateImporter.js";

document.addEventListener("DOMContentLoaded", () => {

    const els = {
        persona: document.getElementById("persona"),
        job: document.getElementById("job"),
        task: document.getElementById("task"),
        input: document.getElementById("input-placeholder"),
        output: document.getElementById("output-format"),

        constraintsList: document.getElementById("constraints-list"),
        variablesList: document.getElementById("variables-list"),
        preview: document.getElementById("xml-preview"),

        copy: document.getElementById("copy-btn"),
        download: document.getElementById("download-btn"),

        addConstraint: document.getElementById("add-constraint"),
        addVariable: document.getElementById("add-variable"),
        beautify: document.getElementById("beautify-btn"),

        importTemplate: document.getElementById("import-template-btn"),
        exportTemplate: document.getElementById("export-template-btn"),
        templateFile: document.getElementById("template-file")
    };

    console.log("App initialized");
    console.log("Import button:", els.importTemplate);

    const renderer = createRenderer(els);

    const state = stateManager.getState();
    renderer.render(state);

    bindInputs(els);
    bindActions(els);
});

/* =========================
   INPUT BINDING
========================= */

function bindInputs(els) {

    els.persona.addEventListener("input", e =>
        stateManager.update("role.persona", e.target.value)
    );

    els.job.addEventListener("input", e =>
        stateManager.update("role.job", e.target.value)
    );

    els.task.addEventListener("input", e =>
        stateManager.update("task", e.target.value)
    );

    els.input.addEventListener("input", e =>
        stateManager.update("input", e.target.value)
    );

    els.output.addEventListener("input", e =>
        stateManager.update("output_format", e.target.value)
    );

    els.addConstraint.addEventListener("click", () => {
        const state = stateManager.getState();
        state.constraints.push("");
        stateManager.setState(state);
    });

    els.addVariable.addEventListener("click", () => {
        const state = stateManager.getState();
        const key = `var_${Date.now()}`;
        state.variables[key] = "";
        stateManager.setState(state);
    });
}

/* =========================
   ACTIONS
========================= */

function bindActions(els) {

    els.copy.addEventListener("click", async () => {
        const xml = generateXML(stateManager.getState());
        await navigator.clipboard.writeText(xml);
    });

    els.download.addEventListener("click", () => {
        const xml = generateXML(stateManager.getState());

        const blob = new Blob([xml], {
            type: "text/plain;charset=utf-8"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "prompt.xml.txt";
        a.click();

        URL.revokeObjectURL(url);
    });

    els.exportTemplate.addEventListener("click", () => {
        const state = stateManager.getState();

        const name = prompt("Template name:", "Untitled Prompt")?.trim() || "Untitled";
        const description = prompt("Description:", "")?.trim() || "";
        const author = prompt("Author:", "")?.trim() || "";

        exportTemplate(state, {
            name,
            description,
            author
        });
    });

    els.importTemplate.addEventListener("click", () => {
        els.templateFile.click();
    });

    els.templateFile.addEventListener("change", async (event) => {
        try {
            const template = await importTemplateFromInput(event.target);
            const importedState = extractState(template);

            stateManager.setState(importedState);

        } catch (err) {
            alert(err.message);
        } finally {
            event.target.value = "";
        }
    });

    els.beautify.addEventListener("click", () => {
        const xml = generateXML(stateManager.getState());
        els.preview.textContent = xml;
    });
}