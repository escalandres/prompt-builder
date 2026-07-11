import { STORAGE_KEYS } from "./constants.js";
import { DEFAULT_SETTINGS } from "./defaults.js";

const subscribers = new Set();

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

function save(settings) {
    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
        console.error("Error saving settings:", e);
    }
}

let settings = load();

function notify() {
    subscribers.forEach((cb) => cb({ ...settings }));
}

export const settingsManager = {
    get() {
        return { ...settings };
    },

    update(key, value) {
        if (!(key in settings)) return;
        settings[key] = value;
        save(settings);
        notify();
    },

    reset() {
        settings = { ...DEFAULT_SETTINGS };
        save(settings);
        notify();
    },

    subscribe(callback) {
        subscribers.add(callback);
    },

    unsubscribe(callback) {
        subscribers.delete(callback);
    },
};
