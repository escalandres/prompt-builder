/**
 * Deep Clone
 *
 * Utilidad centralizada para realizar copias profundas
 * de objetos y arreglos.
 *
 * Prioridad:
 * 1. structuredClone()
 * 2. Clonación manual recursiva
 */

export function deepClone(value) {

    if (typeof structuredClone === "function") {

        return structuredClone(value);

    }

    return cloneRecursive(value);

}

/* ---------------------------------------------------------- */

function cloneRecursive(value) {

    if (
        value === null ||
        typeof value !== "object"
    ) {

        return value;

    }

    if (value instanceof Date) {

        return new Date(value.getTime());

    }

    if (value instanceof RegExp) {

        return new RegExp(
            value.source,
            value.flags
        );

    }

    if (value instanceof Map) {

        const map = new Map();

        value.forEach((v, k) => {

            map.set(
                cloneRecursive(k),
                cloneRecursive(v)
            );

        });

        return map;

    }

    if (value instanceof Set) {

        const set = new Set();

        value.forEach(item => {

            set.add(
                cloneRecursive(item)
            );

        });

        return set;

    }

    if (Array.isArray(value)) {

        return value.map(item =>
            cloneRecursive(item)
        );

    }

    const result = {};

    Object.keys(value).forEach(key => {

        result[key] = cloneRecursive(
            value[key]
        );

    });

    return result;

}

/* ---------------------------------------------------------- */

/**
 * Clona únicamente un arreglo.
 */

export function cloneArray(array) {

    if (!Array.isArray(array)) {

        throw new TypeError(
            "cloneArray expects an array."
        );

    }

    return deepClone(array);

}

/* ---------------------------------------------------------- */

/**
 * Clona únicamente un objeto.
 */

export function cloneObject(object) {

    if (
        object === null ||
        Array.isArray(object) ||
        typeof object !== "object"
    ) {

        throw new TypeError(
            "cloneObject expects an object."
        );

    }

    return deepClone(object);

}

/* ---------------------------------------------------------- */

/**
 * Clona el estado de la aplicación.
 */

export function cloneState(state) {

    return deepClone(state);

}

/* ---------------------------------------------------------- */

/**
 * Congela una copia para evitar modificaciones.
 */

export function immutableClone(value) {

    return deepFreeze(
        deepClone(value)
    );

}

/* ---------------------------------------------------------- */

function deepFreeze(object) {

    if (
        object === null ||
        typeof object !== "object"
    ) {

        return object;

    }

    Object.freeze(object);

    Object.keys(object).forEach(key => {

        deepFreeze(
            object[key]
        );

    });

    return object;

}