import { storage } from "./src/storage.js";
import { generateXML } from "./src/xml.js";
import { clipboard } from "./src/clipboard.js";
import { templates } from "./src/templates.js";

const state = {
    role: {
        persona: "",
        job: ""
    },
    task: "",
    input: "",
    output_format: "",
    constraints: [],
    variables: {}
};

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
    constraintTemplate: document.getElementById("constraint-template"),
    variableTemplate: document.getElementById("variable-template")
};

document.addEventListener("DOMContentLoaded", init);

function init() {
    loadState();
    bindInputs();
    renderAll();
}

function bindInputs() {
    [
        els.persona,
        els.job,
        els.task,
        els.input,
        els.output
    ].forEach(e => e.addEventListener("input", onBasicChange));

    els.addConstraint.addEventListener("click", addConstraint);
    els.addVariable.addEventListener("click", addVariable);

    els.copy.addEventListener("click", copyXml);
    els.download.addEventListener("click", downloadXml);

    els.beautify.addEventListener("click", renderPreview);
}

function onBasicChange() {
    syncFromDOM();
    saveState();
    renderPreview();
}

function syncFromDOM() {
    state.role.persona = els.persona.value;
    state.role.job = els.job.value;
    state.task = els.task.value;
    state.input = els.input.value;
    state.output_format = els.output.value;
}

function addConstraint() {
    state.constraints.push("");
    renderConstraints();
    saveState();
    renderPreview();
}

function addVariable() {
    const key = `var_${Date.now()}`;
    state.variables[key] = "";
    renderVariables();
    saveState();
    renderPreview();
}

function renderConstraints() {
    els.constraintsList.innerHTML = "";

    state.constraints.forEach((value, index) => {
        const node = els.constraintTemplate.content.firstElementChild.cloneNode(true);
        const input = node.querySelector(".constraint-input");
        const remove = node.querySelector(".remove-item");

        input.value = value;

        input.addEventListener("input", (e) => {
            state.constraints[index] = e.target.value;
            saveState();
            renderPreview();
        });

        remove.addEventListener("click", () => {
            state.constraints.splice(index, 1);
            renderConstraints();
            saveState();
            renderPreview();
        });

        els.constraintsList.appendChild(node);
    });
}

function renderVariables() {
    els.variablesList.innerHTML = "";

    Object.entries(state.variables).forEach(([key, value]) => {
        const node = els.variableTemplate.content.firstElementChild.cloneNode(true);

        const name = node.querySelector(".variable-name");
        const val = node.querySelector(".variable-value");
        const remove = node.querySelector(".remove-item");

        name.value = key;
        val.value = value;

        name.addEventListener("input", (e) => {
            const newKey = e.target.value;

            if (newKey !== key) {
                state.variables[newKey] = state.variables[key];
                delete state.variables[key];
            }

            saveState();
            renderPreview();
        });

        val.addEventListener("input", (e) => {
            state.variables[key] = e.target.value;
            saveState();
            renderPreview();
        });

        remove.addEventListener("click", () => {
            delete state.variables[key];
            renderVariables();
            saveState();
            renderPreview();
        });

        els.variablesList.appendChild(node);
    });
}

function renderPreview() {
    els.preview.textContent = generateXML(state);
}

function copyXml() {
    clipboard.copy(generateXML(state)).then(() => {
        const original = els.copy.textContent;
        els.copy.textContent = "Copied!";
        setTimeout(() => (els.copy.textContent = original), 1500);
    });
}

function downloadXml() {
    const blob = new Blob([generateXML(state)], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "prompt.xml.txt";

    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
}

function saveState() {
    storage.save(state);
}

function loadState() {
    const saved = storage.load();

    if (!saved) {
        return;
    }

    state.role = saved.role || state.role;
    state.task = saved.task || "";
    state.input = saved.input || "";
    state.output_format = saved.output_format || "";
    state.constraints = saved.constraints || [];
    state.variables = saved.variables || {};
}

function renderAll() {
    els.persona.value = state.role.persona;
    els.job.value = state.role.job;
    els.task.value = state.task;
    els.input.value = state.input;
    els.output.value = state.output_format;

    renderConstraints();
    renderVariables();
    renderPreview();
}