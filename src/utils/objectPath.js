/**
 * ObjectPath
 *
 * Utilidades para acceder y modificar propiedades
 * anidadas mediante rutas tipo:
 *
 * role.persona
 * variables.0.name
 * constraints.2
 */

/* ---------------------------------------------------------- */
/* Obtener valor                                               */
/* ---------------------------------------------------------- */

export function get(object, path, defaultValue = undefined) {

    if (!path) {
        return object;
    }

    const keys = normalize(path);

    let current = object;

    for (const key of keys) {

        if (current == null) {
            return defaultValue;
        }

        current = current[key];

    }

    return current === undefined
        ? defaultValue
        : current;

}

/* ---------------------------------------------------------- */
/* Establecer valor                                            */
/* ---------------------------------------------------------- */

export function set(object, path, value) {

    const keys = normalize(path);

    let current = object;

    while (keys.length > 1) {

        const key = keys.shift();

        if (
            current[key] === undefined ||
            current[key] === null
        ) {

            current[key] = isNumeric(keys[0])
                ? []
                : {};

        }

        current = current[key];

    }

    current[keys[0]] = value;

    return object;

}

/* ---------------------------------------------------------- */
/* Verificar existencia                                        */
/* ---------------------------------------------------------- */

export function has(object, path) {

    return get(
        object,
        path,
        Symbol("missing")
    ) !== Symbol.for("missing");

}

/* ---------------------------------------------------------- */
/* Eliminar propiedad                                          */
/* ---------------------------------------------------------- */

export function remove(object, path) {

    const keys = normalize(path);

    let current = object;

    while (keys.length > 1) {

        const key = keys.shift();

        if (current[key] == null) {
            return false;
        }

        current = current[key];

    }

    const lastKey = keys[0];

    if (Array.isArray(current)) {

        current.splice(Number(lastKey), 1);

    } else {

        delete current[lastKey];

    }

    return true;

}

/* ---------------------------------------------------------- */
/* Actualizar usando callback                                  */
/* ---------------------------------------------------------- */

export function update(object, path, updater) {

    const current = get(object, path);

    const next = updater(current);

    set(
        object,
        path,
        next
    );

    return next;

}

/* ---------------------------------------------------------- */
/* Crear si no existe                                          */
/* ---------------------------------------------------------- */

export function ensure(object, path, defaultValue = {}) {

    if (!exists(object, path)) {

        set(
            object,
            path,
            defaultValue
        );

    }

    return get(
        object,
        path
    );

}

/* ---------------------------------------------------------- */
/* Verificar existencia real                                   */
/* ---------------------------------------------------------- */

export function exists(object, path) {

    const keys = normalize(path);

    let current = object;

    for (const key of keys) {

        if (
            current == null ||
            !(key in current)
        ) {

            return false;

        }

        current = current[key];

    }

    return true;

}

/* ---------------------------------------------------------- */
/* Obtener todas las rutas                                     */
/* ---------------------------------------------------------- */

export function flatten(object) {

    const result = {};

    walk(
        object,
        "",
        result
    );

    return result;

}

function walk(value, path, output) {

    if (
        value === null ||
        typeof value !== "object"
    ) {

        output[path] = value;
        return;

    }

    Object.entries(value).forEach(([key, child]) => {

        const nextPath = path
            ? `${path}.${key}`
            : key;

        walk(
            child,
            nextPath,
            output
        );

    });

}

/* ---------------------------------------------------------- */
/* Helpers                                                     */
/* ---------------------------------------------------------- */

function normalize(path) {

    if (Array.isArray(path)) {
        return [...path];
    }

    return String(path)
        .split(".")
        .filter(Boolean);

}

function isNumeric(value) {

    return !Number.isNaN(
        Number(value)
    );

}