'use strict';

function load() {
    chrome.storage.local.get(['rules'], function (result) {
        if (typeof result.rules !== 'undefined') {
            $('#item_list tfoot tr.message').hide()
            for (const [index, rule] of Object.entries(result.rules)) {
                let $newRow = $($('#new_row_template').clone(true).html())
                for (const [key, val] of Object.entries(rule)) {
                    if ($('input[name="' + key + '"]', $newRow).length > 0) {
                        $('input[name="' + key + '"]', $newRow).val(val);
                    } else if ($('select[name="' + key + '"]', $newRow).length > 0) {
                        $('select[name="' + key + '"]', $newRow).prop("selected", false)
                        $('select[name="' + key + '"] option[value="' + val + '"]', $newRow).prop("selected", true)
                    }
                }

                $newRow.find('button.save').prop('disabled', true)
                $newRow.appendTo('#item_list')
            }
        }
    })
}

load()


$('#new_rule').on('click', function (e) {
    e.preventDefault()
    $('#item_list tfoot tr.message').hide()
    let newRow = $('#new_row_template').html()
    $('#item_list tbody').append(newRow)
})

$('#clear_rules').on('click', function (e) {
    e.preventDefault()
    clearStorage()
    $('#item_list tbody').html('')
    $('#item_list tfoot tr.message').show()
})


$(document).on('click', '.save', async function () {
    let trElement = $(this).parent('td').parent('tr')
    let trElementIndex = $(trElement).index();

    let rules = {}
    rules[trElementIndex] = {}
    trElement.find('td input, td select').each((index, element) => {
        let name = $(element).attr('name')
        let elementValue = $(element).val()

        rules[trElementIndex][name] = elementValue
    })

    getStorage('rules').then((result) => {
        if (typeof result.rules !== 'undefined') {
            let oldRules = Object.values(result.rules)
            rules = Object.assign({}, oldRules, rules);
        }

        storage('rules', rules)
    })

    $(this).prop('disabled', true);
})

$(document).on('click', '#apply_rules', async function (e) {
    e.preventDefault()
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

$(document).on('click', '#apply_random', async function (e) {
    e.preventDefault()
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
    return chrome.storage.local.set({[itemKey]: itemValue})
}

function getStorage(itemKey) {
    return chrome.storage.local.get([itemKey])
}

function clearStorage() {
    return chrome.storage.local.clear();
}