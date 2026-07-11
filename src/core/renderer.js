import { generateXML } from "../services/xml.js";
import {
    createConstraintItem,
    createVariableItem
} from "./domFactory.js";

export function createRenderer(elements) {

    function render(state) {

        renderInputs(state);
        renderConstraints(state);
        renderVariables(state);
        renderPreview(state);

    }

    /* ---------------------------------------------------------- */

    function renderInputs(state) {

        if (elements.persona.value !== state.role.persona) {
            elements.persona.value = state.role.persona;
        }

        if (elements.job.value !== state.role.job) {
            elements.job.value = state.role.job;
        }

        if (elements.task.value !== state.task) {
            elements.task.value = state.task;
        }

        if (elements.input.value !== state.input) {
            elements.input.value = state.input;
        }

        if (elements.output.value !== state.output_format) {
            elements.output.value = state.output_format;
        }

    }

    /* ---------------------------------------------------------- */

    function renderPreview(state) {

        const xml = generateXML(state);

        if (elements.preview.textContent !== xml) {
            elements.preview.textContent = xml;
        }

    }

    /* ---------------------------------------------------------- */

    function renderConstraints(state) {

        const container = elements.constraintsList;

        const current = container.children.length;
        const target = state.constraints.length;

        while (container.children.length > target) {
            container.lastElementChild.remove();
        }

        state.constraints.forEach((constraint, index) => {

            let item = container.children[index];

            if (!item) {

                item = createConstraintItem(
                    constraint,
                    index
                );

                container.appendChild(item);

            }

            item.dataset.index = index;

            const input =
                item.querySelector(".constraint-input");

            if (input.value !== constraint) {
                input.value = constraint;
            }

        });

    }

    /* ---------------------------------------------------------- */

    function renderVariables(state) {

        const container = elements.variablesList;

        const target = state.variables.length;

        while (container.children.length > target) {
            container.lastElementChild.remove();
        }

        state.variables.forEach((variable, index) => {

            let item = container.children[index];

            if (!item) {

                item = createVariableItem(
                    variable.name,
                    variable.value,
                    index
                );

                container.appendChild(item);

            }

            item.dataset.index = index;

            const key =
                item.querySelector(".variable-name");

            const value =
                item.querySelector(".variable-value");

            if (key.value !== variable.name) {
                key.value = variable.name;
            }

            if (value.value !== variable.value) {
                value.value = variable.value;
            }

        });

    }

    return {

        render,
        renderPreview

    };

}