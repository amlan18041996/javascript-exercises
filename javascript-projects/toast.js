import { button, div } from "../utilities/dom-builder.js";

const DEFAULT_OPTIONS = {
    autoClose: 5000,
    position: 'top-center',
    onClose: () => { },
    canClose: true,
    showProgress: true,
    width: '300px',
};

export default function Toast(options) {
    const createContainer = function (position) {
        const container = div({ class: 'toast-container' });
        container.dataset.position = position;
        document.body.append(container);
        return container;
    };

    function update(options) {
        Object.entries(options).forEach(([key, value]) => (checker[key] = value));
    }

    const checker = {
        toastElem: null,
        autoCloseInterval: null,
        progressInterval: null,
        removeBinded: null,
        unpause: null,
        isPaused: false,
        pause: null,
        shouldUnPause: null,
        visibilityChange: null,
        timeVisible: 0,
        autoCloseValue: null,
        onClose: () => { },
        remove: function () {
            cancelAnimationFrame(this.autoCloseInterval);
            cancelAnimationFrame(this.progressInterval);
            const container = this.toastElem.parentElement;
            this.toastElem.classList.remove('show');
            this.toastElem.addEventListener('transitionend', () => {
                this.toastElem.remove();
                if (container.hasChildNodes()) return;
                container.remove();
            });
            this.onClose();
        },
        set width(value) {
            const container = document.querySelector(`.toast-container`);
            container.style.setProperty('--width', value);
        },
        set autoClose(value) {
            this.timeVisible = 0;
            this.autoCloseValue = value;
            if (value === false) return;
            let lastTime;
            const func = (time) => {
                if (this.shouldUnPause) {
                    lastTime = null;
                    this.shouldUnPause = false;
                }
                if (lastTime == null) {
                    lastTime = time;
                    this.autoCloseInterval = requestAnimationFrame(func);
                    return;
                }
                if (!this.isPaused) {
                    this.timeVisible += time - lastTime;
                    if (this.timeVisible >= value) {
                        this.remove();
                        return;
                    }
                }

                lastTime = time;
                this.autoCloseInterval = requestAnimationFrame(func);
            };
            this.autoCloseInterval = requestAnimationFrame(func);
        },
        set position(value) {
            const currentContainer = this.toastElem.parentElement;
            const selector = `.toast-container[data-position="${value}"]`;
            const container =
                document.querySelector(selector) || createContainer(value);
            container.append(this.toastElem);
            if (currentContainer == null || currentContainer.hasChildNodes()) return;
            currentContainer.remove();
        },
        set text(value) {
            this.toastElem.children[0].append(value);
        },
        set canClose(value) {
            this.toastElem.classList.toggle('can-close', value);
            if (value) this.toastElem.addEventListener('click', this.removeBinded);
            else this.toastElem.removeEventListener('click', this.removeBinded);
        },
        set showProgress(value) {
            this.toastElem.classList.toggle('progress', value);
            this.toastElem.style.setProperty('--progress', 1);
            this.toastElem.style.setProperty('--color', 'red');

            if (value) {
                const func = () => {
                    if (!this.isPaused) {
                        this.toastElem.style.setProperty(
                            '--progress',
                            1 - this.timeVisible / this.autoCloseValue
                        );
                    }
                    this.progressInterval = requestAnimationFrame(func);
                };
                this.progressInterval = requestAnimationFrame(func);
            }
        },
        set pauseOnHover(value) {
            if (value) {
                this.toastElem.addEventListener('mouseover', this.pause);
                this.toastElem.addEventListener('mouseleave', this.unpause);
            } else {
                this.toastElem.removeEventListener('mouseover', this.pause);
                this.toastElem.removeEventListener('mouseleave', this.unpause);
            }
        },
        set pauseOnFocusLoss(value) {
            if (value)
                document.addEventListener('visibilitychange', this.visibilityChange);
            else
                document.removeEventListener('visibilitychange', this.visibilityChange);
        },
    };

    console.log('Toast Initiated');
    const closeBtn = button({
        type: 'button',
        class: 'w-6 h-6 inline-flex items-center justify-center ms-auto -mx-1.5 -my-1.5 p-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 hover:bg-gray-100'
    });
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>';
    checker.toastElem = div(
        { class: 'toast flex p-4' },
        div({ class: 'ms-3 text-sm font-normal' }),
        closeBtn
    );
    requestAnimationFrame(() => checker.toastElem.classList.add('show'));
    checker.removeBinded = checker.remove.bind(checker);
    checker.unpause = () => (checker.isPaused = false);
    checker.pause = () => (checker.isPaused = true);
    checker.visibilityChange = () =>
        (checker.shouldUnPause = document.visibilityState === 'visible');
    update({ ...DEFAULT_OPTIONS, ...options });
}
