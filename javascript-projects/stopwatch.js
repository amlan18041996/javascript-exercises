export default function Stopwatch() {
    let running;
    let time = '00 : 00 : 00 : 00';
    let milliseconds = 0;
    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let interval;

    (function () {
        document.getElementById('stopwatch-output').innerText = time;
        document.getElementById('start').disabled = false;
        document.getElementById('pause').disabled = true;
        document.getElementById('stop').disabled = true;
        document.getElementById('reset').disabled = true;
    })();

    const clearTimerValues = function () {
        time = '00 : 00 : 00 : 00';
        milliseconds = 0;
        seconds = 0;
        minutes = 0;
        hours = 0;

        document.getElementById('start').disabled = false;
        document.getElementById('pause').disabled = true;
        document.getElementById('stop').disabled = true;
        document.getElementById('reset').disabled = true;
    };

    const timer = function () {
        interval = setInterval(function () {
            milliseconds += 10;
            if (milliseconds === 1000) {
                seconds = seconds + 1;
                milliseconds = 0;
            }
            if (seconds === 60) {
                minutes = minutes + 1;
                seconds = 0;
            }
            if (minutes === 60) {
                hours = hours + 1;
                minutes = 0;
            }
            time =
                (hours < 9 ? '0' + hours : hours) +
                ' : ' +
                (minutes < 9 ? '0' + minutes : minutes) +
                ' : ' +
                (seconds < 9 ? '0' + seconds : seconds) +
                ' : ' +
                (milliseconds < 9 ? '0' + milliseconds : milliseconds);
            document.getElementById('stopwatch-output').innerText = time;
        }, 10);
    };

    this.start = function () {
        // console.log('Stopwatch started');
        running = true;
        document.getElementById('start').disabled = true;
        document.getElementById('pause').disabled = false;
        document.getElementById('stop').disabled = false;
        document.getElementById('reset').disabled = false;
        timer();
        return time;
    };

    this.stop = function () {
        // console.log('Stopwatch stopped');
        running = false;
        document.getElementById('start').disabled = true;
        document.getElementById('pause').disabled = true;
        document.getElementById('stop').disabled = true;
        document.getElementById('reset').disabled = true;
        clearTimeout(interval);
        clearTimerValues();
        return time;
    };

    this.pause = function () {
        //   console.log('Stopwatch paused');
        if (running) {
            clearTimeout(interval);
            document.getElementById('stop').disabled = true;
            document.getElementById('reset').disabled = true;
            document.getElementById('pause').innerText = 'Resume';
            running = false;
        } else {
            document.getElementById('stop').disabled = false;
            document.getElementById('reset').disabled = false;
            document.getElementById('pause').innerText = 'Pause';
            running = true;
            timer();
        }
        return time;
    };

    this.reset = function () {
        //   console.log('Stopwatch reset');
        running = false;
        clearTimeout(interval);
        clearTimerValues();
        time = '00 : 00 : 00 : 00';
        document.getElementById('stopwatch-output').innerText = time;
        return time;
    };
}