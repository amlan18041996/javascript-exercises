class InterceptorManager {
    constructor() {
        this.handlers = [];
    }

    use(fulfilled, rejected) {
        this.handlers.push({ fulfilled, rejected });
        return this.handlers.length - 1;
    }

    eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }

    clear() {
        this.handlers = [];
    }

    async process(initial) {
        let result = initial;
        for (const handler of this.handlers) {
            if (handler) {
                try {
                    result = await handler.fulfilled(result);
                } catch (error) {
                    if (handler.rejected) {
                        result = await handler.rejected(error);
                    } else {
                        throw error;
                    }
                }
            }
        }
        return result;
    }
}

export class HttpClient {
    constructor(config = {}) {
        this.baseURL = config.baseURL || '';
        this.timeout = config.timeout || 0;
        this.retries = config.retries || 0;
        this.retryDelay = config.retryDelay || 1000;
        this.headers = { ...config.headers };

        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager(),
        };
    }

    async request(method, url, options = {}) {
        let config = {
            method,
            url: `${this.baseURL}${url}`,
            headers: { ...this.headers, ...options.headers },
            signal: options.signal,
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        } else {
            config.body = options.body;
        }

        try {
            config = await this.interceptors.request.process(config);
        } catch (error) {
            throw error;
        }

        return this._fetchWithRetry(config);
    }

    async _fetchWithRetry(config, attempt = 0) {
        let controller;
        let signal = config.signal;

        if (this.timeout > 0 && !signal) {
            controller = new AbortController();
            signal = controller.signal;
            setTimeout(() => controller.abort(), this.timeout);
        }

        try {
            const response = await fetch(config.url, {
                method: config.method,
                headers: config.headers,
                body: config.body,
                signal,
            });

            return await this.interceptors.response.process(response);
        } catch (error) {
            if (error.name === 'AbortError') {
                throw error;
            }

            if (attempt < this.retries) {
                const delay = this.retryDelay * Math.pow(2, attempt) + Math.random() * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return this._fetchWithRetry(config, attempt + 1);
            }

            throw error;
        }
    }

    get(url, options = {}) {
        return this.request('GET', url, options);
    }

    post(url, options = {}) {
        return this.request('POST', url, options);
    }

    put(url, options = {}) {
        return this.request('PUT', url, options);
    }

    patch(url, options = {}) {
        return this.request('PATCH', url, options);
    }

    delete(url, options = {}) {
        return this.request('DELETE', url, options);
    }
}
