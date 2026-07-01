// storage.js

const STORAGE_KEY = "prompt_builder_state";

export const storage = {
    save(state) {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem(STORAGE_KEY, serializedState);
        } catch (error) {
            console.error("Error saving state to localStorage:", error);
        }
    },

    load() {
        try {
            const serializedState = localStorage.getItem(STORAGE_KEY);

            if (!serializedState) {
                return null;
            }

            return JSON.parse(serializedState);
        } catch (error) {
            console.error("Error loading state from localStorage:", error);
            return null;
        }
    },

    clear() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("Error clearing state from localStorage:", error);
        }
    }
};