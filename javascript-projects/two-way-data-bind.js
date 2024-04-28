export default function TwoWayBind(elObj) {
    let elementBindings = [];
    let value = elObj.object[elObj.property];

    let valueGetter = function () {
        return value;
    }

    let valueSetter = function (changedValue) {
        // console.log(changedValue);
        value = changedValue;
        value = changedValue;
        for (let i = 0; i < elementBindings.length; i++) {
            const binding = elementBindings[i];
            binding.element[binding.attribute] = changedValue;
        }
    }

    this.bindEl = function (element, attribute, event) {
        // console.log(element, attribute, event);
        var binding = { element: element, attribute: attribute }
        if (event) {
            element.addEventListener(event, function () {
                valueSetter(element[attribute]);
            });
            binding.event = event;
        }
        elementBindings.push(binding);
        element[attribute] = value;
    }

    Object.defineProperty(elObj.object, elObj.property, {
        get: valueGetter,
        set: valueSetter
    });

    elObj.object[elObj.property] = value;
}