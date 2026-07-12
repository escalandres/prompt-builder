import { t } from "../i18n/index.js";

export function createConstraintItem(value = "", index = 0) {

    const container = document.createElement("div");
    container.className = "list-item";
    container.dataset.index = index;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "constraint-input";
    input.value = value;
    input.placeholder = t("form.constraintPlaceholder");

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "icon-btn remove-item";
    remove.title = t("form.removeConstraint");
    remove.setAttribute("aria-label", t("form.removeConstraint"));

    remove.innerHTML = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M18 6L6 18"/>
            <path d="M6 6L18 18"/>
        </svg>
    `;

    container.append(
        input,
        remove
    );

    return container;

}

export function createVariableItem(
    key = "",
    value = "",
    index = 0
) {

    const container = document.createElement("div");
    container.className = "variable-item";
    container.dataset.index = index;

    const keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.className = "variable-name";
    keyInput.placeholder = t("form.variableNamePlaceholder");
    keyInput.value = key;

    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.className = "variable-value";
    valueInput.placeholder = t("form.variableValuePlaceholder");
    valueInput.value = value;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "icon-btn remove-item";
    remove.title = t("form.removeVariable");
    remove.setAttribute("aria-label", t("form.removeVariable"));

    remove.innerHTML = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M18 6L6 18"/>
            <path d="M6 6L18 18"/>
        </svg>
    `;

    container.append(
        keyInput,
        valueInput,
        remove
    );

    return container;

}