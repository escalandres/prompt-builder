import { importTemplate, extractState, extractMetadata } from "../services/templateImporter.js";
import { stateManager } from "../core/stateManager.js";
import { notify } from "../ui/notification.js";

export function createImportModal() {
    const overlay = document.getElementById("import-overlay");
    const panel = document.getElementById("import-panel");
    const closeBtn = document.getElementById("import-close");
    const fileInput = document.getElementById("import-file-input");
    const dropZone = document.getElementById("import-dropzone");
    const errorEl = document.getElementById("import-error");

    function open() {
        overlay.classList.add("visible");
        panel.classList.add("open");
        errorEl.classList.add("hidden");
        fileInput.value = "";
    }

    function close() {
        overlay.classList.remove("visible");
        panel.classList.remove("open");
    }

    async function handleFile(file) {
        if (!file) return;

        try {
            const template = await importTemplate(file);
            const state = extractState(template);
            const meta = extractMetadata(template);

            stateManager.replace(state);
            notify(`Imported: ${meta.name}`, "success");
            close();
        } catch (err) {
            errorEl.textContent = err.message;
            errorEl.classList.remove("hidden");
        }
    }

    fileInput.addEventListener("change", () => {
        handleFile(fileInput.files[0]);
    });

    dropZone.addEventListener("click", () => fileInput.click());

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dropzone-active");
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.classList.remove("dropzone-active");
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dropzone-active");
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    });

    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel.classList.contains("open")) close();
    });

    return { open, close };
}
