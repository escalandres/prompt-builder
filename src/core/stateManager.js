import { storage } from "../services/storage.js";

const STORAGE_KEY = "prompt-builder-state-v1";

const defaultState = {
    role: {
        persona: "",
        job: ""
    },
    task: "",
    input: "",
    output_format: "",
    constraints: [],
    variables: {}
};

let state = loadState();

const listeners = new Set();

function loadState() {
    const saved = storage.load?.(STORAGE_KEY);

    if (!saved) {
        return structuredClone(defaultState);
    }

    return {
        ...structuredClone(defaultState),
        ...saved
    };
}

function saveState() {
    storage.save?.(state, STORAGE_KEY);
}

export const stateManager = {
    getState() {
        return state;
    },

    setState(newState) {
        state = {
            ...state,
            ...newState
        };

        saveState();
        notify();
    },

    update(path, value) {
        const keys = path.split(".");
        let target = state;

        for (let i = 0; i < keys.length - 1; i++) {
            target = target[keys[i]];
        }

        target[keys[keys.length - 1]] = value;

        saveState();
        notify();
    },

    subscribe(fn) {
        listeners.add(fn);

        return () => listeners.delete(fn);
    }
};

function notify() {
    for (const fn of listeners) {
        fn(state);
    }
}