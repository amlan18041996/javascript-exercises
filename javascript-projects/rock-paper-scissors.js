import Toast from "./toast.js";

const RPS = ['rock', 'paper', 'scissors'];
const EMOJIS = { rock: '✊', paper: '✋', scissors: '✌️' };
const BEATS = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
const ROUND_SECONDS = 3;
const AUTO_RESUME_SECONDS = 5;

export default function RockPaperScissors(container) {
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

    function showToastMsg(text, dur) {
        new Toast({ text, position: 'bottom-center', duration: dur || 5, stacked: false, pauseOnHover: true });
    }

    function updateScore() {
        winEl.textContent = wins;
        lossEl.textContent = losses;
        totalEl.textContent = totalGames;
    }

    function showFinalChoices(pChoice, bChoice) {
        playerBox.textContent = EMOJIS[pChoice];
        botBox.textContent = EMOJIS[bChoice];
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

        const botChoice = RPS[Math.floor(Math.random() * 3)];
        let elapsed = 0;
        let count = ROUND_SECONDS;

        const tick = setInterval(() => {
            elapsed += 0.1;
            if (elapsed < ROUND_SECONDS) {
                playerBox.textContent = EMOJIS[RPS[Math.floor(Math.random() * 3)]];
                botBox.textContent = EMOJIS[RPS[Math.floor(Math.random() * 3)]];
                const newCount = ROUND_SECONDS - Math.ceil(elapsed);
                if (newCount !== count && newCount > 0) {
                    count = newCount;
                    timerEl.textContent = count;
                }
            } else {
                clearInterval(tick);
                const pChoice = userChoice || RPS[Math.floor(Math.random() * 3)];
                showFinalChoices(pChoice, botChoice);
                timerEl.textContent = '';
                totalGames++;

                if (pChoice === botChoice) {
                    showToastMsg('Draw! 🤝', 3);
                } else if (BEATS[pChoice] === botChoice) {
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
}
