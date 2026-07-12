import { settingsManager } from "../config/settings.js";
import { INDENT_SIZES, FONT_SIZES, THEMES, LANGUAGES } from "../config/constants.js";
import { setLanguage } from "../i18n/index.js";

export function createSettingsPanel() {
    const panel = document.getElementById("settings-panel");
    const overlay = document.getElementById("settings-overlay");
    const toggleBtn = document.getElementById("settings-btn");
    const closeBtn = document.getElementById("settings-close");

    const formFields = {
        defaultPersona: document.getElementById("settings-default-persona"),
        defaultJob: document.getElementById("settings-default-job"),
        defaultTask: document.getElementById("settings-default-task"),
        defaultOutputFormat: document.getElementById("settings-default-output-format"),
        indentSize: document.getElementById("settings-indent-size"),
        fontSize: document.getElementById("settings-font-size"),
        theme: document.getElementById("settings-theme"),
        language: document.getElementById("settings-language"),
        autoPreview: document.getElementById("settings-auto-preview"),
        compactMode: document.getElementById("settings-compact-mode"),
    };

    function open() {
        panel.classList.add("open");
        overlay.classList.add("visible");
        render();
    }

    function close() {
        panel.classList.remove("open");
        overlay.classList.remove("visible");
    }

    function render() {
        const s = settingsManager.get();
        formFields.defaultPersona.value = s.defaultPersona || "";
        formFields.defaultJob.value = s.defaultJob || "";
        formFields.defaultTask.value = s.defaultTask || "";
        formFields.defaultOutputFormat.value = s.defaultOutputFormat || "";
        formFields.indentSize.value = String(s.indentSize);
        formFields.fontSize.value = s.fontSize || "14px";
        formFields.theme.value = s.theme || "dark";
        formFields.language.value = s.language || "en";
        formFields.autoPreview.checked = s.autoPreview;
        formFields.compactMode.checked = s.compactMode;
    }

    function handleChange(key, getValue) {
        return () => {
            const el = formFields[key];
            if (!el) return;
            settingsManager.update(key, getValue(el));
        };
    }

    formFields.defaultPersona.addEventListener("input", handleChange("defaultPersona", (el) => el.value));
    formFields.defaultJob.addEventListener("input", handleChange("defaultJob", (el) => el.value));
    formFields.defaultTask.addEventListener("input", handleChange("defaultTask", (el) => el.value));
    formFields.defaultOutputFormat.addEventListener("input", handleChange("defaultOutputFormat", (el) => el.value));
    formFields.indentSize.addEventListener("change", handleChange("indentSize", (el) => Number(el.value)));
    formFields.fontSize.addEventListener("change", handleChange("fontSize", (el) => el.value));
    formFields.autoPreview.addEventListener("change", handleChange("autoPreview", (el) => el.checked));
    formFields.compactMode.addEventListener("change", handleChange("compactMode", (el) => el.checked));

    formFields.theme.addEventListener("change", () => {
        settingsManager.update("theme", formFields.theme.value);
        applyTheme(formFields.theme.value);
    });

    formFields.language.addEventListener("change", () => {
        setLanguage(formFields.language.value);
        settingsManager.update("language", formFields.language.value);
    });

    toggleBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", close);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel.classList.contains("open")) close();
    });

    return { open, close, render };
}

export function applyTheme(theme) {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = theme === "dark" || (theme === "system" && dark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
}
