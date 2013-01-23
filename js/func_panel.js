
function panelForm() {
    return commonPanelForm();
}

function panelInit() {
    hm = commonURL2Hash(window.top.location.href);
    if('u' in hm && hm['u'] != '' && 'c' in hm && hm['c'] != '') {
        panelForm().elements['u'].value = hm['u'];
        cycleObj = commonNext(hm['c'], 
            (('step' in hm && hm['step'] != '') ? hm['step'] : null),
            hm['u'], 0);
        commonPopulate(cycleObj);
    } else {
        commonChangeContent(panelForm().elements['f'].options[0].text);
    }
    return true;
}
    
function panelInfo() {
    if(!panelCheckIsLoaded()) { return true; }
    cycleObj = commonCycle(panelForm().elements['c'].value);
    alert(
    "Current URL: \n" + panelForm().elements['currenturl'].value
    + "\n\nURL template: \n" + panelForm().elements['u'].value
    + "\n\nCycle: " + panelForm().elements['c'].value
    + "\nSteps: " + cycleObj.cbegin + ' ... ' + cycleObj.cend
    + "\nStep: " + panelForm().elements['step'].value
    + "\n\nResource: " + panelResource()
    );
}

function panelScroll(direction) {
    if(!panelCheckIsLoaded()) { return true; }
    cycleObj = commonNext(
        panelForm().elements['c'].value,
        panelForm().elements['step'].value,
        panelForm().elements['u'].value,
        direction
    );
    commonPopulate(cycleObj);
    return true;
}

function panelFileChange() {
    commonChangeContent(panelForm().elements['f'].options[panelForm().elements['f'].selectedIndex].text + '?random=' + Math.random() + '#end');
    return true;
}

function panelResource() {
    return panelForm().elements['f'].options[panelForm().elements['f'].options.selectedIndex].text
        + '#r' + panelForm().elements['rowno'].value
}

function panelRepeatPaths() {
    commonChangeContent(panelResource());
    return true;
}

function panelCheckIsLoaded() {
    checkedValue = panelForm().elements['c'].value;
    if(checkedValue == null || checkedValue == '') {
        alert('Choose cycle.');
        return false;
    }
    return true;
}

function bench() {
    commonChangeContent('../bench.html?f=' + panelForm().elements['f'].value);
    return true;
}