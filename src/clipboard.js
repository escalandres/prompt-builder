// clipboard.js

export const clipboard = {
    async copy(text) {
        try {
            if (!text) return false;

            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            return false;
        }
    },

    async read() {
        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (error) {
            console.error("Error reading from clipboard:", error);
            return null;
        }
    }
};