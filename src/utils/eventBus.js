/**
 * EventBus
 *
 * Sistema de comunicación desacoplado entre componentes.
 *
 * Permite:
 * - Publicar eventos
 * - Suscribirse
 * - Desuscribirse
 * - Escuchar una sola vez
 * - Limpiar listeners
 */

class EventBus {

    constructor() {

        this.events = new Map();

    }

    /**
     * Suscribirse a un evento.
     */
    on(eventName, callback) {

        if (!this.events.has(eventName)) {

            this.events.set(eventName, []);

        }

        this.events
            .get(eventName)
            .push(callback);

        return () => {

            this.off(
                eventName,
                callback
            );

        };

    }

    /**
     * Escuchar solamente una vez.
     */
    once(eventName, callback) {

        const wrapper = payload => {

            callback(payload);

            this.off(
                eventName,
                wrapper
            );

        };

        this.on(
            eventName,
            wrapper
        );

    }

    /**
     * Publicar un evento.
     */
    emit(eventName, payload = null) {

        const listeners =
            this.events.get(eventName);

        if (!listeners) {
            return;
        }

        listeners.forEach(listener => {

            listener(payload);

        });

    }

    /**
     * Eliminar un listener.
     */
    off(eventName, callback) {

        const listeners =
            this.events.get(eventName);

        if (!listeners) {
            return;
        }

        const index =
            listeners.indexOf(callback);

        if (index !== -1) {

            listeners.splice(
                index,
                1
            );

        }

        if (listeners.length === 0) {

            this.events.delete(eventName);

        }

    }

    /**
     * Eliminar todos los listeners de un evento.
     */
    clear(eventName) {

        this.events.delete(eventName);

    }

    /**
     * Limpiar completamente el bus.
     */
    destroy() {

        this.events.clear();

    }

    /**
     * Obtener listeners de un evento.
     */
    listeners(eventName) {

        return this.events.get(eventName) ?? [];

    }

    /**
     * Verificar si un evento tiene listeners.
     */
    has(eventName) {

        return this.events.has(eventName);

    }

    /**
     * Número de eventos registrados.
     */
    size() {

        return this.events.size;

    }

}

export const eventBus = new EventBus();