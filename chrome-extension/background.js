
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'apply') {
        console.log('START CRON', (new Date()).toLocaleTimeString())

        // document.getElementsByTagName('input').value = "test"
        chrome.storage.local.get(['static_value0']).then((res) => {
            console.log('static value result:', res)
        })

        // chrome.tabs.executeScript({file: 'content.js'});
    }
})
