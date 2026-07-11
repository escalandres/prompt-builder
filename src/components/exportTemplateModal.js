import { stateManager } from "../core/stateManager.js";
import { buildTemplate, downloadTemplate } from "../services/templateExporter.js";
import { notify } from "../ui/notification.js";

export function createExportModal() {
    const overlay = document.getElementById("export-overlay");
    const panel = document.getElementById("export-panel");
    const closeBtn = document.getElementById("export-close");
    const nameInput = document.getElementById("export-name");
    const descInput = document.getElementById("export-description");
    const authorInput = document.getElementById("export-author");
    const confirmBtn = document.getElementById("export-confirm");
    const cancelBtn = document.getElementById("export-cancel");

    function open() {
        const state = stateManager.getState();
        overlay.classList.add("visible");
        panel.classList.add("open");
        nameInput.value = "Untitled Prompt";
        descInput.value = "";
        authorInput.value = "";
        nameInput.focus();
    }

    function close() {
        overlay.classList.remove("visible");
        panel.classList.remove("open");
    }

    function handleExport() {
        const state = stateManager.getState();
        const template = buildTemplate(state, {
            name: nameInput.value.trim() || "Untitled Prompt",
            description: descInput.value.trim(),
            author: authorInput.value.trim(),
        });

        downloadTemplate(template);
        notify(`Exported: ${template.metadata.name}`, "success");
        close();
    }

    confirmBtn.addEventListener("click", handleExport);
    cancelBtn.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);

    nameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleExport();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel.classList.contains("open")) close();
    });

    return { open, close };
}
