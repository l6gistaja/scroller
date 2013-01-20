function getTagValues(rowID) {
    var tags = ["u","c"];
    var y = new Object();
    for(t in tags) { y[tags[t]] = $("#"+tags[t]+rowID).html(); }
    return y;
}

function TpCU(rowNo,step) {
    var tags = getTagValues(rowNo);
    return pCU(tags['c'],tags['u'],rowNo,step);
}

function pCU(cycle,url,rowNo,step) {
    if(commonPanelForm().elements['innewwindow'].checked) {
        commonNewWindow(cycle, url, step);
    } else {
        commonPanelForm().elements['u'].value = url;
        commonPanelForm().elements['rowno'].value = rowNo;
        cycleObj = commonNext(cycle, step, url, 0);
        commonPopulate(cycleObj);
    }
    return false;
}

function Tgds(rowNo) {
    var tags = getTagValues(rowNo);
    return gds(tags['c'],tags['u']);
}

function gds(cycle,url) {
    cycleObj = commonNext(cycle, null, url, 0);
    y = "";
    errors = new Array();
    
    // validation
    if(cycle == '') { errors[errors.length] = "Empty cycle!"; }
    if(url == '') { errors[errors.length] = "Empty URL template!"; }
    for(i=0; i<cycleObj.levels.length; i++) {
        if(cycleObj.levels[i].ctype != scrollerConf.typeInt) {
            errors[errors.length] = "Cycle no. " + (i+1) + ": only i(nteger)s are currently supported!";
        }
        if(i>0 && cycleObj.levels[i].cend == scrollerConf.nullEnd) {
            errors[errors.length] = "Cycle no. " + (i+1) + ": nonfirst cycles should have end (4th parameter)!";
        }
    }
    
    if(errors.length == 0) {
        
        realdata = "\n$url = \"" + url + "\";\n@levels = (";
        for(i=0; i<cycleObj.levels.length; i++) {
            realdata += (i==0 ? "" : ",")
                + "\n{\ncbegin => "
                + cycleObj.levels[i].cbegin
                + ",\ncincrement => "
                + cycleObj.levels[i].cincrement
                + (cycleObj.levels[i].cend == scrollerConf.nullEnd ? ''
                    : ",\ncend => " + cycleObj.levels[i].cend)
            + "\n}";
        }
        realdata += "\n);";
        
        datamarker = "###REAL DATA###";
        y = $.ajax({ url: webRoot + "sdownloader.pl", async: false }).responseText;
        cutline = y.indexOf(datamarker);
        y = y.substr(0,cutline) + realdata  + y.substr(cutline + datamarker.length);
    }
    
    if(errors.length > 0) {
     y = '<strong>Errors:</strong><ol>';
     for (err in errors){y += '<li>' + errors[err] + '</li>'; }
     y += '</ol>';
    } else {
        y = '<textarea wrap="virtual" rows="20" cols="80">' + y + '</textarea>';
    }
    
    $("#dialog-modal").dialog({
        modal: true,
        closeText: "Close",
        resizable: true,
        height: "auto",
        width: "auto",
        position: { my: "left top", at: "left top" },
        open: function(event, ui)
        {
            $(this).html(y);
        }
    });
        
    return true;
}