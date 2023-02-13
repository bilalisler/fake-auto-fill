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

    let inputValue = faker.internet.userName();
    if (type === 'email') {
        inputValue = faker.internet.email();
    } else if (type === 'date') {
        inputValue = faker.date.birthdate()
    } else if (type === 'number') {
        let opt={}
        let maxLength = $selectedInput.attr('maxlength')
        if(maxLength){
            opt.length = parseInt(maxLength)
        }
        console.log('opt32:',opt)
        inputValue = faker.datatype.number(opt)
    } else if (type === 'tel') {
        inputValue = faker.phone.number('535#######')
    }

    console.log(type,':',inputValue)
    $selectedInput.val(inputValue)
}

chrome.runtime.onMessage.addListener( // this is the message listener
    function (request, sender, sendResponse) {
        console.log('request:', request);
        if (request.event === 'fillInTheBlanksByRule') {
            for (const [ix, rule] of Object.entries(request.definitionList)) {
                if (rule.inputSelector && rule.inputSelectorValue) {
                    if (rule.inputSelector === 'class') {
                        $('form input.' + rule.inputSelectorValue).val(faker.internet.userName())
                    } else if (rule.inputSelector === 'id') {
                        $('form input#' + rule.inputSelectorValue).val(faker.internet.userName())
                    } else if (rule.inputSelector === 'attribute') {
                        $('form input[' + rule.inputSelectorValue + ']').val(faker.internet.userName())
                    } else if (rule.inputSelector === 'name') {
                        $('form input[name="' + rule.inputSelectorValue + '"]').val(faker.internet.userName())
                    }
                } else if (rule.inputType) {
                    generateValueByType(rule.inputType)
                }
            }
        } else if (request.event === 'fillInTheBlanksRandom') {
            fillTheBlanksByType()
        }

        sendResponse({status: 'ok'});
    }
);
