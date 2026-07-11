/**
 * UID Generator
 *
 * Generador centralizado de identificadores únicos.
 *
 * Uso:
 *
 * const id = uid();
 *
 * constraint_1749128374_a82kf9
 */

let counter = 0;

/* ---------------------------------------------------------- */
/* UID principal                                               */
/* ---------------------------------------------------------- */

export function uid(prefix = "") {

    counter++;

    const timestamp = Date.now().toString(36);

    const random = Math.random()
        .toString(36)
        .substring(2, 10);

    const sequence = counter
        .toString(36)
        .padStart(4, "0");

    return prefix
        ? `${prefix}_${timestamp}_${random}_${sequence}`
        : `${timestamp}_${random}_${sequence}`;

}

/* ---------------------------------------------------------- */
/* UUID v4 compatible                                          */
/* ---------------------------------------------------------- */

export function uuid() {

    if (
        typeof crypto !== "undefined" &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();

    }

    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
        .replace(/[xy]/g, character => {

            const random = Math.random() * 16 | 0;

            const value = character === "x"
                ? random
                : (random & 0x3 | 0x8);

            return value.toString(16);

        });

}

/* ---------------------------------------------------------- */
/* Short Id                                                    */
/* ---------------------------------------------------------- */

export function shortId(length = 8) {

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {

        result += characters.charAt(

            Math.floor(
                Math.random() * characters.length
            )

        );

    }

    return result;

}

/* ---------------------------------------------------------- */
/* Timestamp Id                                                */
/* ---------------------------------------------------------- */

export function timestampId(prefix = "") {

    const id = Date.now();

    return prefix
        ? `${prefix}_${id}`
        : `${id}`;

}

/* ---------------------------------------------------------- */
/* Incremental Id                                              */
/* ---------------------------------------------------------- */

export function incrementalId(prefix = "id") {

    counter++;

    return `${prefix}_${counter}`;

}

/* ---------------------------------------------------------- */
/* Reset Counter                                               */
/* ---------------------------------------------------------- */

export function resetCounter() {

    counter = 0;

}

/* ---------------------------------------------------------- */
/* Read Counter                                                */
/* ---------------------------------------------------------- */

export function currentCounter() {

    return counter;

}