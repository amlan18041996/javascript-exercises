export default function Timer(output, timeInSeconds) {
    output.innerText = "00 : 00 : 00";
    let interval;
    let timeValues = {
        seconds: 0,
        minutes: 0,
        hours: 0,
        get time() {
            return `${this.hours > 9 ? this.hours : '0' + this.hours} : ${this.minutes > 9 ? this.minutes : '0' + this.minutes} : ${this.seconds > 9 ? this.seconds : '0' + this.seconds}`;
        }
    }

    const timer = function () {
        interval = setInterval(() => {
            timeValues.seconds -= 1;
            if (timeValues.seconds === 0) {
                if (timeValues.minutes !== 0) timeValues.seconds = 60;
                if (timeValues.minutes !== 0) timeValues.minutes -= 1;
            }
            if (timeValues.minutes === 0) {
                if (timeValues.hours !== 0) timeValues.minutes = 60;
                if (timeValues.hours !== 0) timeValues.hours -= 1;
            }
            if (timeValues.hours === 0 && timeValues.minutes === 0 && timeValues.seconds === 0) {
                clearInterval(interval);
                clearValues();
            }
            console.log(timeInSeconds);
            output.innerText = timeValues.time;
        }, 1000);
    }

    const calculateTime = function () {
        const totalMinutes = Math.floor(timeInSeconds / 60);
        const seconds = (timeInSeconds % 60) === 0 ? 59 : (timeInSeconds % 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        timeValues.hours = hours;
        timeValues.minutes = minutes;
        timeValues.seconds = seconds;
    }

    const clearValues = function () {
        timeValues.hours = 0;
        timeValues.minutes = 0;
        timeValues.seconds = 0;
        output.innerText = "00 : 00 : 00";
        if (interval) {
            clearInterval(interval);
            clearTimeout(interval);
        }
    }

    this.start = function () {
        calculateTime();
        timer();
    }
}