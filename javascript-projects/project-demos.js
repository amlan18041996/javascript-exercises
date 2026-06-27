import { Calculator } from "./calculator.js";
import TwoWayBind from "./two-way-data-bind.js";
import Toast from "./toast.js";
import Stopwatch from "./stopwatch.js";

const demos = {};

demos.calculator = {
    html: `
        <div id="calc-demo-wrapper" tabindex="0" style="outline:none">
            <div class="mb-2 pb-2 border-b text-lg text-right" id="calculate-result">0</div>
            <div class="actions grid grid-cols-4 gap-2 py-2" id="calc-actions">
                <button class="col-span-2 btn primary">AC</button>
                <button class="btn primary">C</button>
                <button class="btn primary">%</button>
                <button class="btn primary">/</button>
                <button class="btn primary">7</button>
                <button class="btn primary">8</button>
                <button class="btn primary">9</button>
                <button class="btn primary">*</button>
                <button class="btn primary">4</button>
                <button class="btn primary">5</button>
                <button class="btn primary">6</button>
                <button class="btn primary">+</button>
                <button class="btn primary">1</button>
                <button class="btn primary">2</button>
                <button class="btn primary">3</button>
                <button class="btn primary">-</button>
                <button class="btn primary">0</button>
                <button class="btn primary">.</button>
                <button class="btn primary col-span-2">=</button>
            </div>
            <div id="calc-history-demo" class="text-xs text-gray-500 mt-2 space-y-1"></div>
        </div>
    `,
    init(container) {
        const calc = new Calculator();
        const result = container.querySelector('#calculate-result');
        const wrapper = container.querySelector('#calc-demo-wrapper');
        const historyEl = container.querySelector('#calc-history-demo');

        function updateHistory() {
            const h = calc.history;
            if (!h.length) { historyEl.innerHTML = ''; return; }
            historyEl.innerHTML = '<div class="font-medium text-gray-700 mb-1">History:</div>'
                + h.slice(0, 5).map(e =>
                    `<div style="padding:2px 0;border-bottom:1px solid var(--border)">${e.expression} = <strong>${e.result}</strong></div>`
                ).join('');
        }

        function handleInput(text) {
            if (!['AC', 'C', '=', '%', '/', '*', '+', '-', '.', '√'].includes(text)) {
                if (result.textContent.trim() !== '0') result.textContent += text;
                else if (!['+', '-', '*', '/', '%'].includes(text)) result.textContent = text;
                calc.append(text);
            } else if (text === '=') {
                calc.evaluate();
                result.textContent = calc.result;
                updateHistory();
            } else if (text === 'AC') {
                calc.clearAllField();
                result.textContent = calc.result;
            } else if (text === 'C') {
                calc.clearField();
                result.textContent = result.textContent.length > 1 ? result.textContent.slice(0, -1) : '0';
            } else {
                result.textContent += text;
                calc.append(text);
            }
        }

        container.querySelector('#calc-actions').addEventListener('click', e => {
            const btn = e.target.closest('button');
            if (!btn) return;
            handleInput(btn.textContent);
        });

        wrapper.addEventListener('keydown', e => {
            const keyMap = {
                '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
                '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
                '+': '+', '-': '-', '*': '*', '/': '/', '%': '%', '.': '.',
            };
            if (keyMap[e.key]) {
                e.preventDefault();
                handleInput(keyMap[e.key]);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                handleInput('=');
            } else if (e.key === 'Escape') {
                e.preventDefault();
                handleInput('AC');
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                handleInput('C');
            }
        });

        setTimeout(() => wrapper.focus(), 100);
    },
};

demos.toast = {
    html: `
        <div class="toast-demo-fields">
            <select id="toast-position-demo" class="form-element border rounded px-3 py-2 text-sm">
                <option value="top-left">Top Left</option>
                <option value="top-center" selected>Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
            </select>
            <input type="text" id="toast-content-demo" class="form-element border rounded px-3 py-2 text-sm" placeholder="Toast Content" value="Hello from Toast!" />
            <div class="flex items-center gap-3">
                <label class="text-xs font-medium text-gray-500">Duration: <span id="toast-duration-value-demo">5</span>s</label>
                <input type="range" id="toast-duration-demo" min="0" max="15" value="5" step="1" class="flex-1" />
                <span class="text-xs text-gray-400">(0 = stays)</span>
            </div>
            <label class="flex items-center gap-2 text-sm">
                <input type="checkbox" id="toast-stacked-demo" checked /> Stacked toasts
            </label>
            <div class="flex gap-2">
                <button id="show-toast-demo" class="btn primary w-fit">Show Toast</button>
                <button id="show-toast-promise-demo" class="btn primary w-fit">Promise Toast</button>
            </div>
        </div>
    `,
    init(container) {
        const durSlider = container.querySelector('#toast-duration-demo');
        const durValue = container.querySelector('#toast-duration-value-demo');
        durSlider.addEventListener('input', () => { durValue.textContent = durSlider.value; });

        function showToast() {
            const position = container.querySelector('#toast-position-demo').value;
            const content = container.querySelector('#toast-content-demo').value;
            const duration = parseInt(durSlider.value);
            const stacked = container.querySelector('#toast-stacked-demo').checked;
            if (!content) return;
            new Toast({
                text: content,
                position,
                duration,
                stacked,
                pauseOnHover: true,
            });
        }

        container.querySelector('#show-toast-demo').addEventListener('click', showToast);
        container.querySelector('#show-toast-promise-demo').addEventListener('click', () => {
            const position = container.querySelector('#toast-position-demo').value;
            const content = container.querySelector('#toast-content-demo').value;
            const duration = parseInt(durSlider.value);
            const stacked = container.querySelector('#toast-stacked-demo').checked;
            if (!content) return;
            const t = new Toast({
                text: content + ' (promise)',
                position,
                duration,
                stacked,
                pauseOnHover: true,
            });
            t.promise.then(() => {
                new Toast({ text: 'Previous toast was closed!', position, duration: 3, stacked, pauseOnHover: true });
            });
        });
    },
};

demos['two-way-data-bind'] = {
    html: `
        <div class="flex flex-col gap-3">
            <input type="text" id="two-way-input-demo" class="form-element border rounded px-3 py-2 text-sm" placeholder="Type something..." value="Hello" />
            <input type="text" id="two-way-input2-demo" class="form-element border rounded px-3 py-2 text-sm" placeholder="Type something..." value="Hello" />
            <p class="text-lg font-normal" id="two-way-output-demo"></p>
        </div>
    `,
    init(container) {
        let profile = { name: '' };
        let bind = new TwoWayBind({ object: profile, property: 'name' });
        bind.bindEl(container.querySelector('#two-way-input-demo'), 'value', 'keyup');
        bind.bindEl(container.querySelector('#two-way-input2-demo'), 'value', 'keyup');
        bind.bindEl(container.querySelector('#two-way-output-demo'), 'innerHTML');
    },
};

demos.stopwatch = {
    html: `
        <div class="flex flex-col gap-3">
            <span id="stopwatch-output" class="text-3xl text-center font-mono">00 : 00 : 00 : 00</span>
            <div class="flex gap-2 justify-center">
                <button class="btn primary" id="start">Start</button>
                <button class="btn primary" id="pause">Pause</button>
                <button class="btn primary" id="stop">Stop</button>
                <button class="btn primary" id="reset">Reset</button>
            </div>
        </div>
    `,
    init() { new Stopwatch(); },
};

demos.timer = {
    html: `
        <div class="timer-with-clock">
            <form id="timer-form-demo" class="flex flex-col gap-3" style="position:relative">
                <input type="number" placeholder="Time in seconds..." id="timer-input-demo" class="form-element border rounded px-3 py-2 text-sm" value="10" min="1" />
                <span id="timer-output-demo" class="text-3xl text-center font-mono">00:00:00</span>
                <button type="submit" class="btn primary w-fit">Start Countdown</button>
            </form>
            <div class="timer-clock" id="timer-clock-demo">
                <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" stroke-width="4"/>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" stroke-width="4" id="clock-progress-demo" stroke-dasharray="282.74" stroke-dashoffset="0" transform="rotate(-90 50 50)"/>
                    <line x1="50" y1="50" x2="50" y2="15" stroke="var(--text)" stroke-width="2.5" stroke-linecap="round" id="clock-minute-demo" transform-origin="50 50"/>
                    <line x1="50" y1="50" x2="50" y2="25" stroke="var(--text-muted)" stroke-width="1.5" stroke-linecap="round" id="clock-second-demo" transform-origin="50 50"/>
                    <circle cx="50" cy="50" r="3" fill="var(--primary)"/>
                </svg>
            </div>
        </div>
    `,
    init(container) {
        const form = container.querySelector('#timer-form-demo');
        const output = container.querySelector('#timer-output-demo');
        const clockEl = container.querySelector('#timer-clock-demo');
        const progress = container.querySelector('#clock-progress-demo');
        const minuteHand = container.querySelector('#clock-minute-demo');
        const secondHand = container.querySelector('#clock-second-demo');
        let interval = null;
        let shakeTimeout = null;
        let total = 0;

        function playBeep() {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 880;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.5);
            } catch (e) { /* audio not supported */ }
        }

        function pad(n) { return n > 9 ? String(n) : '0' + n; }

        function setColorClass(elapsed) {
            const remaining = total - elapsed;
            const fraction = total > 0 ? remaining / total : 0;
            if (fraction > 0.5) {
                progress.style.stroke = '#10b981';
                output.style.color = '#10b981';
            } else if (fraction > 0.25) {
                progress.style.stroke = '#f59e0b';
                output.style.color = '#f59e0b';
            } else {
                progress.style.stroke = '#ef4444';
                output.style.color = '#ef4444';
            }
        }

        function update(totalSecs, elapsed) {
            const remaining = Math.max(0, totalSecs - elapsed);
            const fraction = totalSecs > 0 ? remaining / totalSecs : 0;
            progress.style.strokeDashoffset = 282.74 * (1 - fraction);
            const hours = Math.floor(remaining / 3600);
            const mins = Math.floor((remaining % 3600) / 60);
            const secs = Math.floor(remaining % 60);
            output.textContent = `${pad(hours)} : ${pad(mins)} : ${pad(secs)}`;
            const minuteDeg = (mins / 60) * 360;
            const secondDeg = (secs / 60) * 360;
            minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
            secondHand.style.transform = `rotate(${secondDeg}deg)`;
            setColorClass(elapsed);
        }

        function stopShake() {
            clockEl.classList.remove('shaking');
            if (shakeTimeout) clearTimeout(shakeTimeout);
            shakeTimeout = null;
        }

        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = container.querySelector('#timer-input-demo');
            if (!input.valueAsNumber) return;
            stopShake();
            if (interval) { clearInterval(interval); interval = null; }
            total = input.valueAsNumber;
            output.style.color = '';
            let elapsed = 0;
            update(total, elapsed);
            interval = setInterval(() => {
                elapsed++;
                update(total, elapsed);
                if (elapsed >= total) {
                    clearInterval(interval);
                    interval = null;
                    clockEl.classList.add('shaking');
                    playBeep();
                    shakeTimeout = setTimeout(stopShake, 5000);
                }
            }, 1000);
        });
    },
};

demos['guess-word'] = {
    html: `
        <div class="guess-game">
            <div class="game-area">
                <div id="guess-word-alphabets-demo" class="flex gap-2 flex-wrap justify-center" style="min-height:44px"></div>
                <div id="guess-word-results-demo" class="text-base font-medium text-center"></div>
                <div class="flex gap-2 justify-center">
                    <button class="btn primary" id="start-guess-game-demo">Start Game</button>
                    <button class="btn primary" id="guess-word-demo" disabled>Guess Word</button>
                </div>
                <div class="hint-list" id="hint-list-demo"><strong>Hints:</strong> Start a game to see hints</div>
                <div class="hint-list" id="desc-list-demo"></div>
            </div>
            <div class="guess-person" id="guess-person-demo">
                <div class="face">😐</div>
                <div class="label">Ready</div>
            </div>
        </div>
    `,
    init(container) {
        let currentWord = null;
        let gameActive = false;
        let guessCount = 0;
        let totalTries = 10;
        let isFetching = false;

        const startBtn = container.querySelector('#start-guess-game-demo');
        const guessBtn = container.querySelector('#guess-word-demo');
        const hintEl = container.querySelector('#hint-list-demo');
        const descEl = container.querySelector('#desc-list-demo');
        const personEl = container.querySelector('#guess-person-demo');
        const faceEl = personEl.querySelector('.face');
        const labelEl = personEl.querySelector('.label');
        const alphabetsEl = container.querySelector('#guess-word-alphabets-demo');

        const fallbackWords = [
            { word: 'apple', desc: 'A round fruit with red or green skin and white flesh', hints: ['A common fruit', 'Makes pie and juice', 'Grows on trees', 'Has 5 letters', 'Starts with A'] },
            { word: 'ocean', desc: 'A vast body of salt water covering most of the Earth', hints: ['Covers 70% of Earth', 'Home to whales and fish', 'Contains salt water', 'Has 5 letters', 'Starts with O'] },
            { word: 'stone', desc: 'A hard solid non-metallic mineral matter', hints: ['Found on the ground', 'Used in construction', 'Hard and solid', 'Has 5 letters', 'Starts with S'] },
        ];

        async function fetchWordFromAI() {
            try {
                const r = await fetch('https://random-word-api.herokuapp.com/word');
                const words = await r.json();
                let word = words[0];
                if (word.length > 10 || word.length < 3) throw new Error('Word too long/short');
                const d = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
                if (!d.ok) throw new Error('Dict API error');
                const data = await d.json();
                const entry = data[0];
                const firstDef = entry.meanings[0].definitions[0];
                const defText = firstDef.definition;
                const partOfSpeech = entry.meanings[0].partOfSpeech;
                const synonyms = firstDef.synonyms || [];
                const example = firstDef.example || '';
                const allSynonyms = entry.meanings.flatMap(m => m.definitions.flatMap(d => d.synonyms || []));
                const uniqueSynonyms = [...new Set(allSynonyms)].slice(0, 5);
                const hints = [
                    `${partOfSpeech}: ${defText.length > 60 ? defText.slice(0, 57) + '...' : defText}`,
                    uniqueSynonyms[0] ? `Synonym: ${uniqueSynonyms[0]}` : `Has ${word.length} letters`,
                    uniqueSynonyms[1] ? `Also means: ${uniqueSynonyms[1]}` : example ? `Example: ${example}` : `First letter: ${word[0].toUpperCase()}`,
                    example ? `Example: ${example.length > 60 ? example.slice(0, 57) + '...' : example}` : uniqueSynonyms[2] ? `Related: ${uniqueSynonyms[2]}` : `Contains "${word[Math.floor(word.length / 2)]}"`,
                    `Word has ${word.length} letters`,
                ].filter(Boolean);
                return { word, desc: defText, hints: hints.slice(0, 5) };
            } catch {
                return fallbackWords[Math.floor(Math.random() * fallbackWords.length)];
            }
        }

        function setPerson(emoji, label, cls) {
            faceEl.textContent = emoji;
            labelEl.textContent = label;
            personEl.className = 'guess-person' + (cls ? ' ' + cls : '');
        }

        function renderInputs(word) {
            alphabetsEl.innerHTML = '';
            for (let i = 0; i < word.length; i++) {
                const inp = document.createElement('input');
                inp.type = 'text';
                inp.maxLength = 1;
                inp.className = 'w-10 h-10 text-center text-lg font-bold border border-gray-300 rounded-md';
                inp.dataset.idx = i;
                inp.addEventListener('input', function () {
                    if (this.value && this.nextElementSibling && this.nextElementSibling.tagName === 'INPUT') {
                        this.nextElementSibling.focus();
                    }
                });
                inp.addEventListener('keydown', function (e) {
                    if (e.key === 'Backspace' && !this.value && this.previousElementSibling && this.previousElementSibling.tagName === 'INPUT') {
                        this.previousElementSibling.focus();
                    }
                });
                alphabetsEl.appendChild(inp);
            }
            if (alphabetsEl.firstChild) alphabetsEl.firstChild.focus();
        }

        function getGuessedWord() {
            return Array.from(alphabetsEl.children).map(i => i.value).join('');
        }

        function showHint(shownCount) {
            if (!currentWord) return;
            const hints = currentWord.hints;
            const toShow = Math.min(shownCount, hints.length);
            if (toShow === 0) {
                hintEl.innerHTML = '<strong>Hints:</strong> Make a wrong guess to reveal hints';
                return;
            }
            const items = hints.slice(0, toShow).map((h, i) => `${i + 1}. ${h}`).join('<br>');
            hintEl.innerHTML = `<strong>Hints (${toShow}/${hints.length}):</strong><br>${items}`;
        }

        function showDescription(reveal) {
            if (!currentWord) return;
            const guessed = getGuessedWord().toLowerCase();
            const isWin = guessed === currentWord.word;
            if (isWin || reveal) {
                const wordArr = currentWord.word.split('');
                const guessedArr = getGuessedWord().toLowerCase().split('');
                let display = wordArr.map((ch, i) => {
                    if (guessedArr[i] === ch) return ch;
                    return `<span style="color:#ef4444;font-weight:700">${ch}</span>`;
                }).join('');
                descEl.innerHTML = `<strong>Word:</strong> ${display}<br><strong>Description:</strong> ${currentWord.desc}`;
            } else {
                descEl.innerHTML = `<strong>Description:</strong> ${currentWord.desc}`;
            }
        }

        function resetGame(btnText) {
            gameActive = false;
            guessBtn.disabled = true;
            startBtn.disabled = false;
            startBtn.textContent = btnText || 'Start Game';
        }

        function showToastMsg(text, dur) {
            new Toast({ text, position: 'bottom-center', duration: dur || 5, stacked: false, pauseOnHover: true });
        }

        function checkGameOver() {
            const guessed = getGuessedWord().toLowerCase();
            const word = currentWord.word;
            if (guessed === word) {
                setPerson('🎉', 'Winner!', 'happy');
                showDescription(false);
                showToastMsg('You guessed the right word! Hooray!!!', 6);
                resetGame('Play Again');
                return true;
            }
            if (guessCount >= totalTries) {
                setPerson('😭', 'Game Over', 'sad');
                showDescription(true);
                showToastMsg(`Game Over! The word was: ${word}`, 8);
                resetGame('Play Again');
                return true;
            }
            return false;
        }

        startBtn.addEventListener('click', async () => {
            if (isFetching) return;
            isFetching = true;
            startBtn.disabled = true;
            startBtn.textContent = 'Fetching word...';
            setPerson('⏳', 'Loading...');
            currentWord = await fetchWordFromAI();
            isFetching = false;
            guessCount = 0;
            gameActive = true;
            guessBtn.disabled = false;
            startBtn.disabled = true;
            startBtn.textContent = 'Playing...';
            hintEl.innerHTML = '<strong>Hints:</strong> Make a wrong guess to reveal hints';
            showDescription(false);
            setPerson('🤔', 'Thinking...');
            renderInputs(currentWord.word);
        });

        guessBtn.addEventListener('click', () => {
            if (!gameActive || !currentWord) return;
            const guessed = getGuessedWord().toLowerCase();
            if (guessed === currentWord.word) {
                checkGameOver();
                return;
            }
            guessCount++;
            const remaining = totalTries - guessCount;
            showHint(guessCount);
            const remText = remaining > 0 ? `Remaining: ${remaining}` : '';
            showToastMsg(`Wrong! ${remText}`, 3);
            if (remaining <= 5 && remaining > 0) {
                setPerson('😰', `${remaining} left`, 'sad');
            } else if (remaining > 0) {
                setPerson('😅', `${remaining} left`);
            }
            if (!checkGameOver() && remaining > 0) {
                for (const inp of alphabetsEl.children) inp.value = '';
                if (alphabetsEl.firstChild) alphabetsEl.firstChild.focus();
            }
        });
    },
};

demos['rock-paper-scissors'] = {
    html: `
        <div class="rps-game">
            <div class="rps-players">
                <div class="rps-player-box">
                    <div class="person-figure" id="rps-player-person-demo">🧑</div>
                    <div class="person-label">You</div>
                    <div class="rps-choice-box" id="rps-player-choice-demo">🤔</div>
                </div>
                <div class="rps-timer" id="rps-timer-demo">VS</div>
                <div class="rps-player-box">
                    <div class="person-figure" id="rps-bot-person-demo">🤖</div>
                    <div class="person-label">Bot</div>
                    <div class="rps-choice-box" id="rps-bot-choice-demo">🤖</div>
                </div>
            </div>
            <div class="rps-score" id="rps-score-demo" style="display:none">
                <span id="rps-win-count-demo">0</span> Wins | <span id="rps-loss-count-demo">0</span> Losses | <span id="rps-total-demo">0</span> Total
            </div>
            <button class="btn primary" id="rps-start-demo">Start Game</button>
            <div class="rps-options" id="rps-options-demo" style="display:none">
                <button data-rps="rock" title="Rock">✊</button>
                <button data-rps="paper" title="Paper">✋</button>
                <button data-rps="scissors" title="Scissors">✌️</button>
            </div>
        </div>
    `,
    init(container) {
        const rps = ['rock', 'paper', 'scissors'];
        const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };
        const beats = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

        const startBtn = container.querySelector('#rps-start-demo');
        const options = container.querySelector('#rps-options-demo');
        const timerEl = container.querySelector('#rps-timer-demo');
        const playerBox = container.querySelector('#rps-player-choice-demo');
        const botBox = container.querySelector('#rps-bot-choice-demo');
        const scoreEl = container.querySelector('#rps-score-demo');
        const winEl = container.querySelector('#rps-win-count-demo');
        const lossEl = container.querySelector('#rps-loss-count-demo');
        const totalEl = container.querySelector('#rps-total-demo');

        let roundActive = false;
        let userChoice = null;
        let autoPlayTimer = null;
        let wins = 0;
        let losses = 0;
        let totalGames = 0;
        const ROUND_SECONDS = 3;
        const AUTO_RESUME_SECONDS = 5;

        function showToastMsg(text, dur) {
            new Toast({ text, position: 'bottom-center', duration: dur || 5, stacked: false, pauseOnHover: true });
        }

        function updateScore() {
            winEl.textContent = wins;
            lossEl.textContent = losses;
            totalEl.textContent = totalGames;
        }

        function showFinalChoices(pChoice, bChoice) {
            playerBox.textContent = emojis[pChoice];
            botBox.textContent = emojis[bChoice];
        }

        function resetDisplay() {
            userChoice = null;
            options.style.display = 'flex';
            options.querySelectorAll('button').forEach(b => b.disabled = false);
            timerEl.textContent = String(ROUND_SECONDS);
            timerEl.className = 'rps-timer';
            playerBox.textContent = '?';
            botBox.textContent = '?';
        }

        function endSession() {
            roundActive = false;
            if (autoPlayTimer) { clearTimeout(autoPlayTimer); autoPlayTimer = null; }
            startBtn.style.display = 'inline-block';
            options.style.display = 'none';
            options.querySelectorAll('button').forEach(b => b.disabled = false);
            timerEl.textContent = 'VS';
            timerEl.className = 'rps-timer';
            playerBox.textContent = '🤔';
            botBox.textContent = '🤖';
        }

        function playRound() {
            if (!roundActive) return;
            resetDisplay();

            const botChoice = rps[Math.floor(Math.random() * 3)];
            let elapsed = 0;
            let count = ROUND_SECONDS;

            const tick = setInterval(() => {
                elapsed += 0.1;
                if (elapsed < ROUND_SECONDS) {
                    playerBox.textContent = emojis[rps[Math.floor(Math.random() * 3)]];
                    botBox.textContent = emojis[rps[Math.floor(Math.random() * 3)]];
                    const newCount = ROUND_SECONDS - Math.ceil(elapsed);
                    if (newCount !== count && newCount > 0) {
                        count = newCount;
                        timerEl.textContent = count;
                    }
                } else {
                    clearInterval(tick);
                    const pChoice = userChoice || rps[Math.floor(Math.random() * 3)];
                    showFinalChoices(pChoice, botChoice);
                    timerEl.textContent = '';
                    totalGames++;

                    if (pChoice === botChoice) {
                        showToastMsg('Draw! 🤝', 3);
                    } else if (beats[pChoice] === botChoice) {
                        wins++;
                        showToastMsg('You Win! 🎉', 4);
                    } else {
                        losses++;
                        showToastMsg('You Lose! 😞', 3);
                    }

                    updateScore();
                    scoreEl.style.display = 'block';

                    if (losses >= 10) {
                        showToastMsg(`Game Over! You lost 10 times. Final: ${wins}W - ${losses}L`, 8);
                        wins = 0;
                        losses = 0;
                        totalGames = 0;
                        updateScore();
                        endSession();
                    } else {
                        autoPlayTimer = setTimeout(playRound, AUTO_RESUME_SECONDS * 1000);
                    }
                }
            }, 100);
        }

        options.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-rps]');
            if (!btn || !roundActive || userChoice) return;
            userChoice = btn.dataset.rps;
            options.querySelectorAll('button').forEach(b => b.disabled = true);
        });

        startBtn.addEventListener('click', () => {
            if (roundActive) return;
            roundActive = true;
            startBtn.style.display = 'none';
            wins = 0;
            losses = 0;
            totalGames = 0;
            updateScore();
            scoreEl.style.display = 'none';
            playRound();
        });
    },
};

demos.carousel = {
    html: `
        <div class="carousel-demo-wrapper">
            <div class="carousel-demo-fields">
                <div class="cd-row">
                    <label>Duration: <span id="cd-duration-val">3000</span>ms</label>
                    <input type="range" id="cd-duration" min="1000" max="8000" value="3000" step="500" style="flex:1" />
                </div>
                <div class="cd-row cd-inline">
                    <label><input type="checkbox" id="cd-autoplay" checked /> Auto-play</label>
                    <label><input type="checkbox" id="cd-pause-hover" checked /> Pause on hover</label>
                </div>
                <div class="cd-row cd-nav">
                    <button class="btn primary" id="cd-prev">❮ Prev</button>
                    <span class="cd-pagination" id="cd-pagination">0/0</span>
                    <button class="btn primary" id="cd-next">Next ❯</button>
                </div>
            </div>
            <div id="carousel-demo" class="bg-violet-400/20 rounded-xl overflow-hidden">
                <div class="carousel-wrapper relative w-full">
                    <div class="carousel relative min-h-[10rem] md:max-h-[14rem] grid grid-flow-col auto-cols-[100%] overflow-x-auto space-x-2 snap-x snap-mandatory gap-6 rounded-md scroll-smooth">
                        <div data-carousel-item="{{index}}" class="card carousel-slider flex snap-start list-none bg-white flex-col duration-1000 ease-in-out inset-0 transition-transform transform" x-for="/utilities/mock-data/banner-carousel.json">
                            <img src="{{image}}" alt="{{uuid}}" class="relative w-full h-full block object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    async init(container) {
        const { decorateTag } = await import("/utilities/helpers.js");
        const Carousel = (await import("./carousel.js")).default;
        const durSlider = container.querySelector('#cd-duration');
        const durVal = container.querySelector('#cd-duration-val');
        const autoplayChk = container.querySelector('#cd-autoplay');
        const pagination = container.querySelector('#cd-pagination');
        let wrapper = container.querySelector('#carousel-demo');
        let carouselHtml = '';

        durSlider.addEventListener('input', () => {
            durVal.textContent = durSlider.value;
        });

        function replaceBtn(id) {
            const old = container.querySelector('#' + id);
            if (!old) return null;
            const clone = old.cloneNode(true);
            clone.id = id;
            old.parentNode.replaceChild(clone, old);
            return clone;
        }

        function createCarousel() {
            const delay = parseInt(durSlider.value);
            const isAutoPlay = autoplayChk.checked;
            const pauseOnHover = container.querySelector('#cd-pause-hover').checked;
            const total = wrapper.querySelectorAll('.carousel-slider').length;
            pagination.textContent = `0/${total}`;
            new Carousel({
                wrapperEl: '#carousel-demo',
                mainEl: '.carousel',
                delay,
                isAutoPlay,
                pauseOnHover,
                previousElAction: '#cd-prev',
                nextElAction: '#cd-next',
                onChange: (el) => {
                    const num = el?.target ? parseInt(el.target, 10) : 0;
                    pagination.textContent = `${num}/${total}`;
                },
            });
        }

        function build() {
            if (!carouselHtml) return;
            replaceBtn('cd-prev');
            replaceBtn('cd-next');
            const newWrapper = wrapper.cloneNode(true);
            newWrapper.id = 'carousel-demo';
            wrapper.parentNode.replaceChild(newWrapper, wrapper);
            wrapper = newWrapper;
            const carouselEl = wrapper.querySelector('.carousel');
            if (!carouselEl) return;
            carouselEl.innerHTML = carouselHtml;
            createCarousel();
        }

        decorateTag(() => {
            const carouselEl = wrapper.querySelector('.carousel');
            if (carouselEl) carouselHtml = carouselEl.innerHTML;
            build();
        });

        durSlider.addEventListener('change', build);
        autoplayChk.addEventListener('change', build);
        container.querySelector('#cd-pause-hover').addEventListener('change', build);
    },
};

demos['http-client'] = {
    html: `
        <div class="flex flex-col gap-3">
            <div class="flex gap-2">
                <button class="btn primary" id="fetch-posts-demo">Fetch Posts</button>
                <button class="btn primary disabled:opacity-50" id="cancel-request-demo" disabled>Cancel</button>
            </div>
            <div id="posts-output-demo" class="text-sm max-h-48 overflow-y-auto space-y-2"></div>
        </div>
    `,
    async init(container) {
        const { HttpClient } = await import("./http-client.js");
        const api = new HttpClient({
            baseURL: 'https://jsonplaceholder.typicode.com',
            timeout: 10000, retries: 2, retryDelay: 500,
            headers: { 'Accept': 'application/json' },
        });
        api.interceptors.response.use(async r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
        let controller = null;
        container.querySelector('#fetch-posts-demo').addEventListener('click', async () => {
            const output = container.querySelector('#posts-output-demo');
            const cancelBtn = container.querySelector('#cancel-request-demo');
            controller = new AbortController();
            cancelBtn.disabled = false;
            output.innerHTML = '<p class="text-gray-500">Loading...</p>';
            try {
                const posts = await api.get('/posts?_limit=4', { signal: controller.signal });
                output.innerHTML = posts.map(p => `<div class="p-2 border rounded"><strong>${p.title}</strong><p class="text-gray-600 text-xs">${p.body}</p></div>`).join('');
            } catch (err) {
                output.innerHTML = `<p class="text-red-500">${err.name === 'AbortError' ? 'Request cancelled' : 'Error: ' + err.message}</p>`;
            } finally { cancelBtn.disabled = true; controller = null; }
        });
        container.querySelector('#cancel-request-demo').addEventListener('click', () => controller?.abort());
    },
};

demos['state-manager'] = {
    html: `
        <div class="flex flex-col gap-3">
            <div class="text-center text-3xl font-bold" id="counter-display-demo">0</div>
            <div class="text-center text-lg text-gray-600" id="doubled-display-demo">Doubled: 0</div>
            <div class="flex gap-2 justify-center">
                <button class="btn primary" id="decrement-demo">-1</button>
                <button class="btn primary" id="increment-demo">+1</button>
                <button class="btn primary" id="reset-counter-demo">Reset</button>
            </div>
            <hr>
            <p class="font-medium text-sm">Log (middleware):</p>
            <div id="action-log-demo" class="text-xs text-gray-500 max-h-16 overflow-y-auto"></div>
        </div>
    `,
    async init(container) {
        const { createStore } = await import("./state-manager.js");
        const logMiddleware = store => next => (actionName, ...args) => {
            const log = container.querySelector('#action-log-demo');
            const entry = document.createElement('div');
            entry.textContent = `Action: ${actionName}`;
            log.appendChild(entry);
            log.scrollTop = log.scrollHeight;
            next(actionName, ...args);
        };
        const store = createStore({
            state: { count: 0 },
            actions: {
                increment: (state, by = 1) => { state.count += by; },
                decrement: (state, by = 1) => { state.count -= by; },
                reset: (state) => { state.count = 0; },
            },
            middleware: [logMiddleware],
        });
        const display = container.querySelector('#counter-display-demo');
        const doubled = container.querySelector('#doubled-display-demo');
        const doubledVal = store.derived(state => state.count * 2);
        store.subscribe(state => { display.textContent = state.count; doubled.textContent = `Doubled: ${doubledVal.value}`; });
        container.querySelector('#increment-demo').addEventListener('click', () => store.dispatch('increment'));
        container.querySelector('#decrement-demo').addEventListener('click', () => store.dispatch('decrement'));
        container.querySelector('#reset-counter-demo').addEventListener('click', () => store.dispatch('reset'));
    },
};

demos['json-schema-validator'] = {
    html: `
        <div class="flex flex-col gap-4">
            <p class="text-sm text-gray-600">Define a schema and data in JSON format, then validate. Click an example to load preset schemas.</p>
            <div class="flex gap-2 flex-wrap">
                <button class="btn primary btn-sm" data-example="user">User Schema</button>
                <button class="btn primary btn-sm" data-example="shape">Shape Union</button>
                <button class="btn primary btn-sm" data-example="nested">Nested Arrays</button>
                <button class="btn primary btn-sm" data-example="errors">Validation Errors</button>
            </div>
            <div class="tsv-editors">
                <div class="tsv-field">
                    <label class="tsv-label">Schema (JSON)</label>
                    <textarea id="tsv-schema" class="tsv-textarea" spellcheck="false" rows="10">{"type":"object","properties":{}}</textarea>
                </div>
                <div class="tsv-field">
                    <label class="tsv-label">Data (JSON)</label>
                    <textarea id="tsv-data" class="tsv-textarea" spellcheck="false" rows="10">{}</textarea>
                </div>
            </div>
            <button class="btn primary" id="tsv-validate">Validate</button>
            <div id="tsv-output" class="text-sm font-mono bg-gray-50 border rounded p-3 max-h-64 overflow-y-auto whitespace-pre-wrap">Enter a schema and data, then click Validate.</div>
        </div>
    `,
    init(container) {
        const schemaEl = container.querySelector('#tsv-schema');
        const dataEl = container.querySelector('#tsv-data');
        const output = container.querySelector('#tsv-output');

        const v = {
            string: (opts) => ({ kind: 'string', ...opts }),
            number: (opts) => ({ kind: 'number', ...opts }),
            boolean: () => ({ kind: 'boolean' }),
            object: (properties, strict) => ({ kind: 'object', properties, strict }),
            array: (item) => ({ kind: 'array', item }),
            optional: (inner) => ({ kind: 'optional', inner }),
            literal: (value) => ({ kind: 'literal', value }),
            enumeration: (values) => ({ kind: 'enum', values }),
            union: (...variants) => ({ kind: 'union', variants }),
            nullable: (inner) => ({ kind: 'nullable', inner }),
        };

        function parseSchema(json) {
            switch (json.type) {
                case 'string':
                    return { kind: 'string', ...(json.minLength !== undefined && { minLength: json.minLength }), ...(json.maxLength !== undefined && { maxLength: json.maxLength }), ...(json.pattern && { pattern: new RegExp(json.pattern) }) };
                case 'number':
                    return { kind: 'number', ...(json.min !== undefined && { min: json.min }), ...(json.max !== undefined && { max: json.max }), ...(json.integer && { integer: true }) };
                case 'boolean':
                    return { kind: 'boolean' };
                case 'literal':
                    return { kind: 'literal', value: json.value };
                case 'enum':
                    return { kind: 'enum', values: json.values };
                case 'array':
                    if (!json.items) throw new Error('array schema requires "items"');
                    return { kind: 'array', item: parseSchema(json.items) };
                case 'object':
                    if (!json.properties) throw new Error('object schema requires "properties"');
                    const props = {};
                    for (const [k, v] of Object.entries(json.properties)) {
                        const { optional, nullable, ...rest } = v;
                        let ps = parseSchema(rest);
                        if (optional) ps = { kind: 'optional', inner: ps };
                        if (nullable) ps = { kind: 'nullable', inner: ps };
                        props[k] = ps;
                    }
                    return { kind: 'object', properties: props, strict: !!json.strict };
                case 'optional':
                    if (!json.inner) throw new Error('optional schema requires "inner"');
                    return { kind: 'optional', inner: parseSchema(json.inner) };
                case 'nullable':
                    if (!json.inner) throw new Error('nullable schema requires "inner"');
                    return { kind: 'nullable', inner: parseSchema(json.inner) };
                case 'union':
                    if (!json.variants || !json.variants.length) throw new Error('union schema requires "variants"');
                    return { kind: 'union', variants: json.variants.map(parseSchema) };
                default:
                    throw new Error('Unknown schema type: "' + json.type + '"');
            }
        }

        function validateValue(value, schema, path, errors) {
            switch (schema.kind) {
                case 'string':
                    if (typeof value !== 'string') { errors.push(path + ': expected a string'); return null; }
                    if (schema.minLength !== undefined && value.length < schema.minLength) { errors.push(path + ': must be at least ' + schema.minLength + ' characters'); return null; }
                    if (schema.maxLength !== undefined && value.length > schema.maxLength) { errors.push(path + ': must be at most ' + schema.maxLength + ' characters'); return null; }
                    if (schema.pattern && !schema.pattern.test(value)) { errors.push(path + ': pattern mismatch'); return null; }
                    return value;
                case 'number':
                    if (typeof value !== 'number' || isNaN(value)) { errors.push(path + ': expected a number'); return null; }
                    if (schema.min !== undefined && value < schema.min) { errors.push(path + ': must be at least ' + schema.min); return null; }
                    if (schema.max !== undefined && value > schema.max) { errors.push(path + ': must be at most ' + schema.max); return null; }
                    if (schema.integer && !Number.isInteger(value)) { errors.push(path + ': must be an integer'); return null; }
                    return value;
                case 'boolean':
                    if (typeof value !== 'boolean') { errors.push(path + ': expected a boolean'); return null; }
                    return value;
                case 'literal':
                    if (value !== schema.value) { errors.push(path + ': expected ' + JSON.stringify(schema.value)); return null; }
                    return value;
                case 'enum':
                    if (!schema.values.includes(value)) { errors.push(path + ': expected one of ' + schema.values.join(', ')); return null; }
                    return value;
                case 'array':
                    if (!Array.isArray(value)) { errors.push(path + ': expected an array'); return null; }
                    return value.map((item, i) => validateValue(item, schema.item, path + '[' + i + ']', errors));
                case 'object':
                    if (typeof value !== 'object' || value === null || Array.isArray(value)) { errors.push(path + ': expected an object'); return null; }
                    if (schema.strict) {
                        for (const k of Object.keys(value)) if (!(k in schema.properties)) { errors.push(path + ': unexpected key "' + k + '"'); return null; }
                    }
                    const res = {};
                    for (const [k, ps] of Object.entries(schema.properties)) {
                        if (k in value) {
                            const r = validateValue(value[k], ps, path ? path + '.' + k : k, errors);
                            if (r === null) return null;
                            res[k] = r;
                        } else if (ps.kind === 'optional' || ps.kind === 'nullable') continue;
                        else { errors.push((path ? path + '.' + k : k) + ': is required'); return null; }
                    }
                    return res;
                case 'optional':
                    return value === undefined ? undefined : validateValue(value, schema.inner, path, errors);
                case 'nullable':
                    return value === null ? null : validateValue(value, schema.inner, path, errors);
                case 'union':
                    for (const v of schema.variants) {
                        const errs = [];
                        const r = validateValue(value, v, path, errs);
                        if (errs.length === 0) return r;
                    }
                    errors.push(path + ': no union variant matched');
                    return null;
                default:
                    errors.push(path + ': unknown schema kind "' + schema.kind + '"');
                    return null;
            }
        }

        function runValidation() {
            let schemaJson, data;
            try {
                schemaJson = JSON.parse(schemaEl.value);
            } catch (e) {
                output.textContent = '❌ Invalid schema JSON:\n  ' + e.message;
                return;
            }
            try {
                data = JSON.parse(dataEl.value);
            } catch (e) {
                output.textContent = '❌ Invalid data JSON:\n  ' + e.message;
                return;
            }
            let schema;
            try {
                schema = parseSchema(schemaJson);
            } catch (e) {
                output.textContent = '❌ Schema error:\n  ' + e.message;
                return;
            }
            const errors = [];
            const result = validateValue(data, schema, '.', errors);
            if (errors.length) {
                output.textContent = '❌ Validation failed\n\nErrors:\n' + errors.map(e => '  • ' + e).join('\n');
            } else {
                output.textContent = '✅ Validation passed\n\nResult:\n' + JSON.stringify(result, null, 2);
            }
        }

        const examples = {
            user: {
                schema: JSON.stringify({
                    type: 'object',
                    properties: {
                        id: { type: 'number', integer: true },
                        name: { type: 'string', minLength: 1 },
                        email: { type: 'string', pattern: '^[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+$' },
                        role: { type: 'enum', values: ['admin', 'user'] },
                        tags: { type: 'array', items: { type: 'string' } },
                        address: {
                            type: 'object',
                            properties: {
                                street: { type: 'string' },
                                city: { type: 'string' },
                                zip: { type: 'string', optional: true },
                            },
                        },
                    },
                }, null, 2),
                data: JSON.stringify({ id: 1, name: 'Alice', email: 'alice@ex.com', role: 'admin', tags: ['dev'], address: { street: '123 Main', city: 'Springfield' } }, null, 2),
            },
            shape: {
                schema: JSON.stringify({
                    type: 'union',
                    variants: [
                        { type: 'object', properties: { type: { type: 'literal', value: 'circle' }, radius: { type: 'number', min: 0 } } },
                        { type: 'object', properties: { type: { type: 'literal', value: 'rectangle' }, width: { type: 'number', min: 0 }, height: { type: 'number', min: 0 } } },
                    ],
                }, null, 2),
                data: JSON.stringify({ type: 'circle', radius: 5 }, null, 2),
            },
            nested: {
                schema: JSON.stringify({
                    type: 'object',
                    properties: {
                        matrix: { type: 'array', items: { type: 'array', items: { type: 'number' } } },
                        tree: {
                            type: 'object',
                            properties: {
                                value: { type: 'string' },
                                children: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            value: { type: 'string' },
                                            children: { type: 'array', items: { type: 'object', properties: { value: { type: 'string' } } } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }, null, 2),
                data: JSON.stringify({ matrix: [[1, 2], [3, 4]], tree: { value: 'root', children: [{ value: 'a', children: [{ value: 'a1' }, { value: 'a2' }] }] } }, null, 2),
            },
            errors: {
                schema: JSON.stringify({ type: 'object', strict: true, properties: { id: { type: 'number', integer: true }, name: { type: 'string', minLength: 1 } } }, null, 2),
                data: JSON.stringify({ id: 'not-a-number', name: '', extra: 'field' }, null, 2),
            },
        };

        container.querySelectorAll('[data-example]').forEach(btn => {
            btn.addEventListener('click', () => {
                const ex = examples[btn.dataset.example];
                if (ex) {
                    schemaEl.value = ex.schema;
                    dataEl.value = ex.data;
                    runValidation();
                }
            });
        });

        container.querySelector('#tsv-validate').addEventListener('click', runValidation);
    },
};

export default demos;
