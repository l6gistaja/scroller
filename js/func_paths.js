function pCU(cycle,url,rowNo) {
        commonPanelForm().elements['u'].value = url;
        commonPanelForm().elements['rowno'].value = rowNo;
        cycleObj = commonNext(cycle, null, url, 0);
        commonPopulate(cycleObj);
        return false;
}
