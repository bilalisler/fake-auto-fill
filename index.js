const {faker} = require('@faker-js/faker/locale/tr')

console.log('CONTENT.JS')

let types = ["text", "tel", "date", "number", "email"]

function fillTheBlanksByType() {
    for (const [ix, type] of Object.entries(types)) {
        generateValueByType(type)
    }
}

function generateValueByType(inputType) {
    try {
        let typeSelector = getTypeSelector(inputType)

        if (inputType === 'email') {
            $('form input' + typeSelector).val(faker.internet.email())
        } else if (inputType === 'date') {
            $('form input' + typeSelector).val(faker.date.birthdate())
        } else if (inputType === 'number') {
            $('form input' + typeSelector).val(faker.datatype.number())
        } else if (inputType === 'tel') {
            $('form input' + typeSelector).val(faker.phone.number('535#######'))
        } else if (inputType === 'radio') {
            if ($('form input' + typeSelector + ':eq(0)').length) {
                // $('form input' + typeSelector + ':eq(0)').prop('checked', true)
            }
        } else {
            $('form input' + typeSelector).val(faker.name.fullName())
        }
    } catch (error) {
        console.log('error:', error.message)
    }
}

function getTypeSelector(type) {
    return '[type="' + type + '"]'
}

function getRuleSelector(rule) {
    if (rule.inputSelector === 'class') {
        return '.' + rule.inputSelectorValue
    } else if (rule.inputSelector === 'id') {
        return '#' + rule.inputSelectorValue
    } else if (rule.inputSelector === 'attribute') {
        return '[' + rule.inputSelectorValue + ']'
    } else if (rule.inputSelector === 'name') {
        return '[name="' + rule.inputSelectorValue + '"]'
    }

    return ''
}

chrome.runtime.onMessage.addListener( // this is the message listener
    function (request, sender, sendResponse) {

        fillTheBlanksByType()

        if (request.event === 'fillInTheBlanksByRule') {
            for (const [ix, rule] of Object.entries(request.definitionList)) {

                if (rule.inputSelector && rule.inputSelectorValue) {
                    let inputValue = '';

                    let ruleTypeSelector = getTypeSelector(rule.inputType)
                    let ruleSelector = getRuleSelector(rule)
                    let $inputElement = $('form input' + ruleSelector + ruleTypeSelector + ', form textarea' + ruleSelector + ruleTypeSelector)

                    if (rule.staticValue.length > 0) {
                        inputValue = rule.staticValue
                    } else if (rule.predefinedValue.length > 0) {
                        if (rule.predefinedValue === 'turkish_identity_number') {
                            inputValue = tcknGenerator()
                        } else if (rule.predefinedValue === 'full_address') {
                            inputValue = fullAddress()
                        } else {
                            inputValue = getPropByString(faker, rule.predefinedValue.replace('()', ''))()
                        }
                    }

                    $inputElement.val(inputValue)
                } else if (rule.inputType) {
                    generateValueByType(rule)
                }
            }
        } else if (request.event === 'fillInTheBlanksRandom') {
            fillTheBlanksByType()
        }

        sendResponse({status: 'ok'});
    }
)

function fullAddress(){
    return faker.address.streetAddress()
}

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