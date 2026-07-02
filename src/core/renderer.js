import { generateXML } from "../services/xml.js";
import { stateManager } from "./stateManager.js";

export function createRenderer(elements) {
    function render(state) {
        elements.persona.value = state.role.persona;
        elements.job.value = state.role.job;
        elements.task.value = state.task;
        elements.input.value = state.input;
        elements.output.value = state.output_format;

        renderPreview(state);
        renderCounts(state);
    }

    function renderPreview(state) {
        elements.preview.textContent = generateXML(state);
    }

    function renderCounts(state) {
        elements.constraintsList.innerHTML = "";

        state.constraints.forEach((c, i) => {
            const div = document.createElement("div");
            div.className = "item";

            div.innerHTML = `
                <button data-index="${i}" class="remove">x</button>
                <input value="${c}" data-index="${i}" class="constraint-input"/>
            `;

            elements.constraintsList.appendChild(div);
        });

        elements.variablesList.innerHTML = "";

        Object.entries(state.variables).forEach(([k, v]) => {
            const div = document.createElement("div");
            div.className = "item";

            div.innerHTML = `
                <input value="${k}" class="var-key"/>
                <input value="${v}" class="var-value"/>
                <button class="remove">x</button>
            `;

            elements.variablesList.appendChild(div);
        });
    }

    stateManager.subscribe(render);

    return {
        render
    };
}