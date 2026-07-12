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
    }
};