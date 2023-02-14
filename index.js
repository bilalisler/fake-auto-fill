const {faker} = require('@faker-js/faker/locale/tr')

console.log('CONTENT.JS')

let types = ["text", "tel", "date", "number", "email"]

function fillTheBlanksByType() {
    for (const [ix, type] of Object.entries(types)) {
        generateValueByType(type)
    }
}

function generateValueByType(type) {
    let $selectedInput = $('form input[type="' + type + '"]');

    let inputValue = faker.name.fullName();
    if (type === 'email') {
        inputValue = faker.internet.email();
    } else if (type === 'date') {
        inputValue = faker.date.birthdate()
    } else if (type === 'number') {
        inputValue = faker.datatype.number()
    } else if (type === 'tel') {
        inputValue = faker.phone.number('535#######')
    }

    console.log(type, ':', inputValue)
    $selectedInput.val(inputValue)
}

chrome.runtime.onMessage.addListener( // this is the message listener
    function (request, sender, sendResponse) {
        console.log('request:', request);

        fillTheBlanksByType()

        if (request.event === 'fillInTheBlanksByRule') {
            for (const [ix, rule] of Object.entries(request.definitionList)) {
                if (rule.inputSelector && rule.inputSelectorValue) {
                    let inputValue = '';
                    let $inputElement;

                    if (rule.inputSelector === 'class') {
                        $inputElement = $('form input.' + rule.inputSelectorValue + ', form textarea.' + rule.inputSelectorValue)
                    } else if (rule.inputSelector === 'id') {
                        $inputElement = $('form input#' + rule.inputSelectorValue + ', form textarea#' + rule.inputSelectorValue)
                    } else if (rule.inputSelector === 'attribute') {
                        $inputElement = $('form input[' + rule.inputSelectorValue + ']' + ', form textarea[' + rule.inputSelectorValue + ']')
                    } else if (rule.inputSelector === 'name') {
                        $inputElement = $('form input[name="' + rule.inputSelectorValue + '"]' + ', form textarea[name="' + rule.inputSelectorValue + '"]')
                    }

                    if (rule.staticValue) {
                        inputValue = rule.staticValue
                    } else if (rule.dynamicValue) {
                        inputValue = getPropByString(faker,rule.dynamicValue)
                    }

                    $inputElement.val(inputValue)
                } else if (rule.inputType) {
                    generateValueByType(rule.inputType)
                }
            }
        } else if (request.event === 'fillInTheBlanksRandom') {
            fillTheBlanksByType()
        }

        sendResponse({status: 'ok'});
    }
)

function tcknGenerator() {
    var a = "" + Math.floor(900000001 * Math.random() + 1e8),
        b = a.split("").map(function (t) {
            return parseInt(t, 10)
        }),
        c = b[0] + b[2] + b[4] + b[6] + b[8],
        d = b[1] + b[3] + b[5] + b[7],
        e = (7 * c - d) % 10;

    return a + ("" + e) + ("" + (d + c + e) % 10)
}

function getPropByString(obj, propString) {
    if (!propString)
        return obj;

    var prop, props = propString.split('.');

    for (var i = 0, iLen = props.length - 1; i < iLen; i++) {
        prop = props[i];

        var candidate = obj[prop];
        if (candidate !== undefined) {
            obj = candidate;
        } else {
            break;
        }
    }
    return obj[props[i]];
}