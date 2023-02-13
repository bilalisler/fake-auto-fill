'use strict';

$('#new_definition').on('click', function () {
    let newRow = $('#new_row_template').html()
    $('#item_list').append(newRow)
})

$(document).on('click', '.save', async function () {
    let trElement = $(this).parent('td').parent('tr')
    let trElementIndex = $(trElement).index();

    let inputClass = $(trElement).find('input[name="input_class"]').val()
    let inputId = $(trElement).find('input[name="input_id"]').val()
    let inputType = $(trElement).find('select[name="input_type"] option:selected').val()
    let staticValue = $(trElement).find('input[name="static_value"]').val()

    storage('static_value' + trElementIndex, staticValue)
    storage('input_class' + trElementIndex, inputClass)
    storage('input_type' + trElementIndex, inputType)
    storage('input_id' + trElementIndex, inputId)


    // let val = await getStorage('input_class' + trElementIndex)
})

$(document).on('click', '#apply', async function () {

    let definitionList = [];

    $('table#item_list tbody tr').each((trIndex, trElement) => {
        let inputSelector = $(trElement).find('select[name="input_selector"]').val()
        let inputSelectorValue = $(trElement).find('input[name="input_selector_value"]').val()
        let inputType = $(trElement).find('select[name="input_type"] option:selected').val()
        let staticValue = $(trElement).find('input[name="static_value"]').val()

        definitionList.push({
            index: trIndex,
            inputSelector,
            inputSelectorValue,
            inputType,
            staticValue
        })
    })


    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                event: "fillInTheBlanksByRule",
                definitionList
            }, function (response) {
                console.log('process response:', response)
            })
    })
})

$(document).on('click', '#random', async function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {
                event: "fillInTheBlanksRandom"
            }, function (response) {
                console.log('process response:', response)
            })
    })
})

function storage(itemKey, itemValue) {
    chrome.storage.local.set({[itemKey]: itemValue});
}

function getStorage(itemKey) {
    return chrome.storage.local.get([itemKey]);
}