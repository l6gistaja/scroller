var webRoot = '../';

function pCU(cycle,url,rowNo,step) {
    if(commonPanelForm().elements['innewwindow'].checked) {
        commonNewWindow(cycle, url);
    } else {
        commonPanelForm().elements['u'].value = url;
        commonPanelForm().elements['rowno'].value = rowNo;
        cycleObj = commonNext(cycle, step, url, 0);
        commonPopulate(cycleObj);
    }
    return false;
}
