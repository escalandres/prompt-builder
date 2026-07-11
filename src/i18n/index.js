import { en } from "./en.js";
import { es } from "./es.js";

const locales = { en, es };

let currentLang = "en";
let currentStrings = locales.en;

export function setLanguage(lang) {
    if (!locales[lang]) return;
    currentLang = lang;
    currentStrings = locales[lang];
    applyStrings();
}

export function getLanguage() {
    return currentLang;
}

export function t(path) {
    const keys = path.split(".");
    let val = currentStrings;
    for (const k of keys) {
        if (val == null) return path;
        val = val[k];
    }
    return val ?? path;
}

function applyStrings() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.dataset.i18n;
        const text = t(key);
        if (el.tagName === "INPUT" && el.type === "text") {
            el.placeholder = text;
        } else if (el.tagName === "TEXTAREA") {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
        el.title = t(el.dataset.i18nTitle);
    });
}
