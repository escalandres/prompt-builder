/**
 * Throttle
 *
 * Limita la ejecución de una función a una vez cada
 * determinado intervalo de tiempo.
 *
 * Ideal para:
 * - Scroll
 * - Resize
 * - Drag & Drop
 * - Mouse Move
 * - Renderizados pesados
 */

export function throttle(
    callback,
    delay = 100
) {

    let waiting = false;

    return function (...args) {

        if (waiting) {
            return;
        }

        waiting = true;

        callback.apply(
            this,
            args
        );

        setTimeout(() => {

            waiting = false;

        }, delay);

    };

}

/**
 * Throttle con cancelación y ejecución pendiente.
 */

export function createThrottle(
    callback,
    delay = 100
) {

    let waiting = false;
    let pendingArgs = null;
    let timer = null;

    function execute(...args) {

        if (waiting) {

            pendingArgs = args;
            return;

        }

        callback.apply(
            this,
            args
        );

        waiting = true;

        timer = setTimeout(() => {

            waiting = false;

            if (pendingArgs) {

                const args = pendingArgs;
                pendingArgs = null;

                execute(...args);

            }

        }, delay);

    }

    execute.cancel = () => {

        clearTimeout(timer);

        waiting = false;
        pendingArgs = null;

    };

    execute.flush = () => {

        if (!pendingArgs) {
            return;
        }

        const args = pendingArgs;

        pendingArgs = null;

        callback.apply(
            this,
            args
        );

    };

    execute.pending = () => {

        return waiting;

    };

    return execute;

}

/**
 * Throttle para funciones asíncronas.
 */

export function throttleAsync(
    callback,
    delay = 100
) {

    let waiting = false;

    return async function (...args) {

        if (waiting) {
            return;
        }

        waiting = true;

        try {

            return await callback.apply(
                this,
                args
            );

        } finally {

            setTimeout(() => {

                waiting = false;

            }, delay);

        }

    };

}