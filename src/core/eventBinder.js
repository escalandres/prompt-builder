import { stateManager } from "./stateManager.js";
import { clipboard } from "../clipboard.js";
import { generateXML } from "../services/xml.js";
import { formatXML } from "../services/xmlFormatter.js";
import { notify } from "../ui/notification.js";
import { createImportModal } from "../components/importTemplateModal.js";
import { createExportModal } from "../components/exportTemplateModal.js";
import { createTemplateSelector } from "../components/templateSelector.js";

export function createEventBinder(elements, renderer) {

    bindFormInputs();
    bindToolbar();
    bindConstraintEvents();
    bindVariableEvents();

    const importModal = createImportModal();
    const exportModal = createExportModal();
    createTemplateSelector();

    /* ----------------------------------------------------- */

    function bindFormInputs() {

        elements.persona.addEventListener("input", e => {

            stateManager.update("role.persona", e.target.value);

            renderer.renderPreview();

        });

        elements.job.addEventListener("input", e => {

            stateManager.update("role.job", e.target.value);

            renderer.renderPreview();

        });

        elements.task.addEventListener("input", e => {

            stateManager.update("task", e.target.value);

            renderer.renderPreview();

        });

        elements.input.addEventListener("input", e => {

            stateManager.update("input", e.target.value);

            renderer.renderPreview();

        });

        elements.output.addEventListener("input", e => {

            stateManager.update("output_format", e.target.value);

            renderer.renderPreview();

        });

    }

    /* ----------------------------------------------------- */

    function bindToolbar() {

        elements.copy.addEventListener("click", async () => {

            const xml = generateXML(
                stateManager.getState()
            );

            await clipboard.copy(xml);

            notify("XML copied to clipboard", "success");

        });

        if (elements.download) {

            elements.download.addEventListener("click", () => downloadAs("txt"));

        }

        const formatBtn = document.getElementById("download-format-btn");

        const formatMenu = document.getElementById("download-menu");

        if (formatBtn && formatMenu) {

            formatBtn.addEventListener("click", (e) => {

                e.stopPropagation();

                formatMenu.classList.toggle("dropdown-open");

            });

            document.addEventListener("click", () => {

                formatMenu.classList.remove("dropdown-open");

            }, { once: false });

            formatMenu.addEventListener("click", (e) => {

                const item = e.target.closest(".dropdown-item");

                if (item && item.dataset.format) {

                    formatMenu.classList.remove("dropdown-open");

                    downloadAs(item.dataset.format);

                }

            });

        }

        if (elements.beautify) {

            elements.beautify.addEventListener("click", () => {

                const preview = elements.preview;

                const current = preview.textContent;

                if (current) {

                    preview.textContent = formatXML(current);

                    notify("XML formatted", "success");

                }

            });

        }

        if (elements.exportTemplate) {

            elements.exportTemplate.addEventListener("click", () => {

                exportModal.open();

            });

        }

        if (elements.importTemplate) {

            elements.importTemplate.addEventListener("click", () => {

                importModal.open();

            });

        }

    }

    function downloadAs(format) {
        const state = stateManager.getState();
        let content, filename, mime;

        switch (format) {
            case "xml":
                content = formatXML(generateXML(state));
                filename = "prompt.xml";
                mime = "application/xml";
                break;
            case "json": {
                const json = JSON.stringify(state, null, 2);
                content = json;
                filename = "prompt.json";
                mime = "application/json";
                break;
            }
            case "md":
                content = ["# Prompt", "", "```xml", generateXML(state), "```", ""].join("\n");
                filename = "prompt.md";
                mime = "text/markdown";
                break;
            default:
                content = generateXML(state);
                filename = "prompt.txt";
                mime = "text/plain";
        }

        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);

        notify(`Downloaded as ${filename}`, "success");
    }

    /* ----------------------------------------------------- */

    function bindConstraintEvents() {

        elements.addConstraint.addEventListener("click", () => {

            stateManager.addConstraint();

        });

        elements.constraintsList.addEventListener("input", e => {

            if (!e.target.classList.contains("constraint-input")) {
                return;
            }

            const item = e.target.closest(".list-item");

            const index = Number(item.dataset.index);

            stateManager.updateConstraint(
                index,
                e.target.value
            );

            renderer.renderPreview();

        });

        elements.constraintsList.addEventListener("click", e => {

            const button = e.target.closest(".remove-item");

            if (!button) {
                return;
            }

            const item = button.closest(".list-item");

            const index = Number(item.dataset.index);

            stateManager.removeConstraint(index);

        });

    }

    /* ----------------------------------------------------- */

    function bindVariableEvents() {

        elements.addVariable.addEventListener("click", () => {

            stateManager.addVariable();

        });

        elements.variablesList.addEventListener("input", e => {

            const item = e.target.closest(".variable-item");

            if (!item) {
                return;
            }

            const index = Number(item.dataset.index);

            const key =
                item.querySelector(".variable-name").value;

            const value =
                item.querySelector(".variable-value").value;

            stateManager.updateVariable(
                index,
                key,
                value
            );

            renderer.renderPreview();

        });

        elements.variablesList.addEventListener("click", e => {

            const button = e.target.closest(".remove-item");

            if (!button) {
                return;
            }

            const item = button.closest(".variable-item");

            const index = Number(item.dataset.index);

            stateManager.removeVariable(index);

        });

    }

}
