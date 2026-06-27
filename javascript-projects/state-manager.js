function createDeepProxy(target, onChange, path = []) {
    const cache = new Map();

    return new Proxy(target, {
        get(target, prop, receiver) {
            if (prop === '__isProxy') return true;
            const value = Reflect.get(target, prop, receiver);
            if (value !== null && typeof value === 'object') {
                if (cache.has(value)) return cache.get(value);
                const proxy = createDeepProxy(value, onChange, [...path, prop]);
                cache.set(value, proxy);
                return proxy;
            }
            return value;
        },
        set(target, prop, value, receiver) {
            const old = Reflect.get(target, prop, receiver);
            if (old !== value) {
                Reflect.set(target, prop, value, receiver);
                onChange({ path: [...path, String(prop)], old, new: value });
            }
            return true;
        },
        deleteProperty(target, prop) {
            if (Reflect.has(target, prop)) {
                const old = Reflect.get(target, prop);
                Reflect.deleteProperty(target, prop);
                onChange({ path: [...path, String(prop)], old, new: undefined, deleted: true });
            }
            return true;
        },
    });
}

export function createStore({ state: initialState = {}, actions = {}, middleware = [] }) {
    const _state = { ...initialState };
    const listeners = new Set();

    function notify() {
        const snapshot = { ..._state };
        listeners.forEach(fn => fn(snapshot));
    }

    const state = createDeepProxy(_state, notify);

    function getState() {
        return state;
    }

    let dispatch = (actionName, ...args) => {
        const action = actions[actionName];
        if (!action) {
            throw new Error(`Action "${actionName}" not found`);
        }
        action(state, ...args);
    };

    if (middleware.length > 0) {
        const api = { getState: () => ({ ..._state }), dispatch: (name, ...args) => dispatch(name, ...args) };
        dispatch = middleware.reduceRight((next, mw) => mw(api)(next), dispatch);
    }

    function subscribe(fn) {
        if (typeof fn !== 'function') throw new Error('Subscriber must be a function');
        listeners.add(fn);
        return () => listeners.delete(fn);
    }

    function derived(selector) {
        let value = selector(state);
        const subs = new Set();
        const unsub = subscribe(() => {
            const newVal = selector(state);
            if (newVal !== value) {
                value = newVal;
                subs.forEach(fn => fn(value));
            }
        });
        return {
            get value() { return value; },
            subscribe(fn) {
                subs.add(fn);
                return () => subs.delete(fn);
            },
            unsubscribe() { unsub(); },
        };
    }

    return { getState, dispatch, subscribe, derived };
}
