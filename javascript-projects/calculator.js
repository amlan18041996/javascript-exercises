import calculatorActions from '../utilities/mock-data/calculator-actions.json';

export function Calculator() {
    let calculate = [];
    let result = 0;
    let historyEntries = [];

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
            const expression = calculate.map(c => c.name).join('');
            calculate.unshift({ name: '(', description: '', value: 'operator' });
            calculate.push({ name: ')', description: '', value: 'operator' });
            const resultAsString = calculate.map(calc => calc.name).join('');
            result = eval(resultAsString);
            historyEntries.unshift({ expression, result });
            if (historyEntries.length > 10) historyEntries.pop();
        } else result = 0;
    }
    Object.defineProperty(this, 'result', {
        get: function () {
            return result;
        }
    });
    Object.defineProperty(this, 'history', {
        get: function () {
            return historyEntries;
        }
    });
}
