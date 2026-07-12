import { STORAGE_KEYS } from "./constants.js";
import { DEFAULT_SETTINGS } from "./defaults.js";

const subscribers = new Set();

function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        const parsed = raw ? JSON.parse(raw) : {};
        const allowed = {};
        for (const key of Object.keys(DEFAULT_SETTINGS)) {
            allowed[key] = key in parsed ? parsed[key] : DEFAULT_SETTINGS[key];
        }
        return allowed;
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
        if (!Object.hasOwn(DEFAULT_SETTINGS, key)) return;
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
