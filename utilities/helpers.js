import { domEl } from "./dom-builder.js";

export function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

export function scrollToTop() {
    let scrollAnimation;
    const position =
        document.body.scrollTop || document.documentElement.scrollTop;
    if (position) {
        window.scrollBy(0, -Math.max(1, Math.floor(position / 10)));
        scrollAnimation = setTimeout(() => scrollToTop(), 10);
    } else clearTimeout(scrollAnimation);
}

export function decorateAccordions(wrapperEl, loopedData) {
    let i = 1;
    const container = document.querySelector(wrapperEl);
    const containerWrapper = container.querySelector('.accordions');
    const slideSkeleton = container.querySelector('.accordion-item');
    containerWrapper.innerHTML = '';
    for (const slide of loopedData) {
        let updatedSkeleton = slideSkeleton;
        updatedSkeleton = updatedSkeleton.outerHTML.toString();
        for (const slideOptions in slide) {
            updatedSkeleton = updatedSkeleton.replaceAll(
                `{{${slideOptions}}}`,
                slide[slideOptions]
            );
        }
        updatedSkeleton = new DOMParser().parseFromString(
            updatedSkeleton,
            'text/html'
        );
        containerWrapper.innerHTML += updatedSkeleton.body.innerHTML;
        i++;
    }
}

export function decorateTag(callback) {
    const allTags = document.querySelectorAll('*[x-for]');
    allTags.forEach(element => {
        const attrValue = element.getAttribute('x-for');
        fetch(`${window.location.origin}/${attrValue}`)
            .then(response => {
                return response.json();
            })
            .then(response => {
                let index = 1;
                for (const res of response) {
                    let updatedSkeleton = element.cloneNode(true);
                    updatedSkeleton.removeAttribute('x-for');
                    updatedSkeleton = updatedSkeleton.outerHTML.toString();
                    for (const resOptions in res) {
                        updatedSkeleton = updatedSkeleton.replaceAll(
                            `{{${resOptions}}}`,
                            res[resOptions]
                        );
                    }
                    updatedSkeleton = updatedSkeleton.replaceAll('{{index}}', index);
                    updatedSkeleton = new DOMParser().parseFromString(
                        updatedSkeleton,
                        'text/html'
                    );
                    updatedSkeleton = updatedSkeleton.body.children[0];
                    element.parentNode.insertBefore(updatedSkeleton, element);
                    index++;
                }
                element.remove();
            })
            .finally(() => callback());
    });
}