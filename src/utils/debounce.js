/**
 * Debounce
 *
 * Retrasa la ejecución de una función hasta que deje
 * de invocarse durante un tiempo determinado.
 *
 * Ideal para:
 * - Autosave
 * - Render del preview
 * - Validaciones
 * - Búsquedas
 */

export function debounce(
    callback,
    delay = 300
) {

    let timer = null;

    return function (...args) {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback.apply(
                this,
                args
            );

        }, delay);

    };

}

/**
 * Debounce con cancelación.
 */

export function createDebounce(
    callback,
    delay = 300
) {

    let timer = null;

    function execute(...args) {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback.apply(
                this,
                args
            );

        }, delay);

    }

    execute.cancel = () => {

        clearTimeout(timer);

        timer = null;

    };

    execute.flush = (...args) => {

        clearTimeout(timer);

        callback.apply(
            this,
            args
        );

    };

    execute.pending = () => {

        return timer !== null;

    };

    return execute;

}

/**
 * Debounce para métodos async.
 */

export function debounceAsync(
    callback,
    delay = 300
) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        return new Promise(resolve => {

            timer = setTimeout(async () => {

                resolve(
                    await callback(...args)
                );

            }, delay);

        });

    };

}