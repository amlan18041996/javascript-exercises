import { calculatorActions } from "../utils/mock-data.js";

export function Calculator() {
    let calculate = [];
    let result = 0;
    this.append = (data) => {
        if (!(calculate.length === 0 && ['+', '-', '*', '/', '%'].includes(data))) {
            const filterJsonField = calculatorActions.filter(action => action.name === data);
            calculate.push(...filterJsonField);
        }
    }
    this.clearField = () => {
        calculate.pop();
    }
    this.clearAllField = () => {
        calculate = [];
        result = 0;
    }
    this.evaluate = () => {
        if (calculate.length > 0) {
            calculate.unshift({ name: '(', description: '', value: 'operator' });
            calculate.push({ name: ')', description: '', value: 'operator' });
            const resultAsString = calculate.map(calc => {
                return calc.name;
            }).join('');
            result = eval(resultAsString);
        } else result = 0;
    }
    Object.defineProperty(this, 'result', {
        get: function () {
            return result;
        }
    });
}