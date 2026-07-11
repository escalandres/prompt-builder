import { templates } from "../templates.js";
import { stateManager } from "../core/stateManager.js";
import { notify } from "../ui/notification.js";

export function createTemplateSelector() {
    const btn = document.getElementById("template-selector-btn");
    const menu = document.getElementById("template-selector-menu");

    if (!btn || !menu) return;

    function renderMenu() {
        menu.innerHTML = "";
        Object.entries(templates).forEach(([key, tmpl]) => {
            const item = document.createElement("button");
            item.className = "dropdown-item";
            item.dataset.template = key;
            item.innerHTML = `<strong>${tmpl.name}</strong><br><small>${tmpl.description}</small>`;
            menu.appendChild(item);
        });
    }

    function loadTemplate(key) {
        const tmpl = templates[key];
        if (!tmpl) return;

        const normalized = {
            role: {
                persona: tmpl.structure.role?.persona || "",
                job: tmpl.structure.role?.job || "",
            },
            task: tmpl.structure.task || "",
            constraints: Array.isArray(tmpl.structure.constraints)
                ? tmpl.structure.constraints.map((c) => (typeof c === "string" ? c : c.text || ""))
                : [],
            input: tmpl.structure.input || "{{input}}",
            output_format: tmpl.structure.output_format || "",
            variables: [],
        };

        stateManager.replace(normalized);
        notify(`Loaded: ${tmpl.name}`, "success");
    }

    renderMenu();

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("dropdown-open");
    });

    document.addEventListener("click", () => {
        menu.classList.remove("dropdown-open");
    });

    menu.addEventListener("click", (e) => {
        const item = e.target.closest(".dropdown-item");
        if (item && item.dataset.template) {
            menu.classList.remove("dropdown-open");
            loadTemplate(item.dataset.template);
        }
    });
}
