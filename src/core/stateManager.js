import { storage } from "../services/storage.js";

const DEFAULT_STATE = {
    role: {
        persona: "",
        job: ""
    },

    task: "",

    constraints: [],

    input: "{{input}}",

    output_format: "",

    variables: []
};

let state = storage.load() ?? structuredClone(DEFAULT_STATE);

const subscribers = new Set();

function notify() {

    storage.save(state);

    subscribers.forEach(callback => callback(getState()));

}

function clone(value) {

    return structuredClone(value);

}

export const stateManager = {

    subscribe(callback) {

        subscribers.add(callback);

    },

    unsubscribe(callback) {

        subscribers.delete(callback);

    },

    getState() {

        return clone(state);

    },

    replace(newState) {

        state = clone(newState);

        notify();

    },

    reset() {

        state = clone(DEFAULT_STATE);

        notify();

    },

    update(path, value) {

        const keys = path.split(".");

        let current = state;

        while (keys.length > 1) {

            current = current[keys.shift()];

        }

        current[keys[0]] = value;

        storage.save(state);

    },

    /* -------------------------------------------------- */
    /* Constraints                                         */
    /* -------------------------------------------------- */

    addConstraint() {

        state.constraints.push("");

        notify();

    },

    updateConstraint(index, value) {

        if (!(index in state.constraints)) {
            return;
        }

        state.constraints[index] = value;

        storage.save(state);

    },

    removeConstraint(index) {

        if (!(index in state.constraints)) {
            return;
        }

        state.constraints.splice(index, 1);

        notify();

    },

    /* -------------------------------------------------- */
    /* Variables                                           */
    /* -------------------------------------------------- */

    addVariable() {

        state.variables.push({
            name: "",
            value: ""
        });

        notify();

    },

    updateVariable(index, name, value) {

        if (!(index in state.variables)) {
            return;
        }

        state.variables[index] = {
            name,
            value
        };

        storage.save(state);

    },

    removeVariable(index) {

        if (!(index in state.variables)) {
            return;
        }

        state.variables.splice(index, 1);

        notify();

    }

};