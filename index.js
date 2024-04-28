import { Calculator } from "./javascript-projects/calculator.js";
import Carousel from "./javascript-projects/carousel.js";
import TwoWayBind from "./javascript-projects/two-way-data-bind.js";
import Toast from "./javascript-projects/toast.js";
import { decorateTag, scrollToTop } from "./utilities/helpers.js";
import Stopwatch from "./javascript-projects/stopwatch.js";
import Timer from "./javascript-projects/timer.js";

function initiateBanner(wrapperEl) {
    const container = document.querySelector(wrapperEl);
    new Carousel({
        wrapperEl: wrapperEl,
        mainEl: '.carousel',
        delay: 2000,
        isAutoPlay: true,
        previousElAction: 'button#previous-slide',
        nextElAction: 'button#next-slide',
        onChange: (elPosition) => {
            container.querySelector('.carousel-paginate').innerHTML = `${parseInt(
                elPosition.target,
                10
            )}/6`;
        },
    });
}

function initializeCalculator() {
    const calc = new Calculator();
    document.querySelectorAll('.actions button').forEach(btn => {
        btn.addEventListener('click', () => {
            const calculateResult = document.querySelector('#calculate-result');
            if (!['AC', 'C', '√', '='].includes(btn.textContent)) {
                if (calculateResult.textContent.trim() !== '0') calculateResult.textContent += btn.textContent;
                else if (!['+', '-', '*', '/', '%'].includes(btn.textContent)) calculateResult.textContent = btn.textContent;
                calc.append(btn.textContent);
            } else if (btn.textContent.includes('=')) {
                calc.evaluate();
                calculateResult.textContent = calc.result;
            } else if (btn.textContent.includes('AC')) {
                calc.clearAllField();
                calculateResult.textContent = calc.result;
            } else if (btn.textContent.includes('C')) {
                calc.clearField();
                const text = calculateResult.textContent.trim();
                calculateResult.textContent = calculateResult.textContent.length > 1 ? text.substring(0, text.length - 1) : 0;
            }
        });
    });
}

window.onload = function () {
    console.log('Javascript Initiated');

    window.onscroll = function () {
        const scrollTop = document.getElementById('scroll-top');
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            scrollTop.classList.remove('hidden');
            scrollTop.classList.add('flex');
        } else {
            scrollTop.classList.remove('flex');
            scrollTop.classList.add('hidden');
        }
    };
    // When the user clicks on the button, scroll to the top of the document
    document.getElementById('scroll-top').children[0].addEventListener('click', scrollToTop);

    // SHOW TOAST
    document.querySelector('#show-toast').addEventListener('click', function () {
        const position = document.querySelector('#toast-position');
        const content = document.querySelector('#toast-content');
        console.log('Show Toast', position.value);
        if (
            position &&
            position.value &&
            position.value.trim() !== '' &&
            content &&
            content.value &&
            content.value.trim() !== ''
        ) {
            new Toast({
                text: content.value,
                position: position.value,
                pauseOnHover: true,
                pauseOnFocusLoss: true,
                autoClose: false,
                onClose: () => { },
            });
        }
    });

    let profile = { name: '' }
    let bind = new TwoWayBind({ object: profile, property: 'name' });
    bind.bindEl(document.getElementById('two-way-input'), 'value', 'keyup');
    bind.bindEl(document.getElementById('two-way-output'), 'innerHTML');

    const watchstop = new Stopwatch();
    document.querySelector('#start').addEventListener('click', () => watchstop.start());
    document.querySelector('#pause').addEventListener('click', () => watchstop.pause());
    document.querySelector('#stop').addEventListener('click', () => watchstop.stop());
    document.querySelector('#reset').addEventListener('click', () => watchstop.reset());

    const countdownFormEl = document.getElementById('startCountdown');
    countdownFormEl.addEventListener('submit', e => {
        e.preventDefault();
        let timeInSeconds = document.getElementById('timeInSeconds');
        console.log(timeInSeconds, timeInSeconds.valueAsNumber);
        if (timeInSeconds.valueAsNumber) {
            const count = new Timer(document.getElementById('timer-output'), timeInSeconds.valueAsNumber);
            count.start();
        }
    });

    function initializeAll() {
        initializeCalculator();
        initiateBanner('#banner-carousel');
    }
    decorateTag(initializeAll);
}