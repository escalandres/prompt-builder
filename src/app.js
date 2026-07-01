import { stateManager } from "./core/stateManager.js";
import { createRenderer } from "./core/renderer.js";
import { generateXML } from "./services/xml.js";

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
        download: document.getElementById("download-btn")
    };

    const renderer = createRenderer(els);

    const state = stateManager.getState();

    renderer.render(state);

    bindInputs(els);
    bindActions(els);
});

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
}

function bindActions(els) {
    els.copy.addEventListener("click", async () => {
        const xml = generateXML(stateManager.getState());
        await navigator.clipboard.writeText(xml);
    });

    els.download.addEventListener("click", () => {
        const xml = generateXML(stateManager.getState());

        const blob = new Blob([xml], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "prompt.xml.txt";
        a.click();

        URL.revokeObjectURL(url);
    });
}