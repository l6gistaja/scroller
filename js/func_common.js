
var scrollerConf = {
    placeholder0 : '{',
    placeholder1 : '}',
    typeInt : 'i',
    typeDate : 'd',
    delimiterCycles : ';',
    delimiterCycle : '.',
    delimiterSteps : '.',
    delimiterPlaceholder : ':',
    nullEnd : '∞'
};

function commonPadWithDelimiter(count, valentine, delimiter) {
    return ((count>0) ? delimiter : '') + valentine;
}

function commonPanelForm() {
    return parent.panel.document.forms['panelform'];
}

function commonChangeContent(url) {
    if(url.match(/^[a-z]+:\/\//)) {
        player = commonPanelForm().elements['p'].options[commonPanelForm().elements['p'].selectedIndex].value;
        if(player.length > 1) {
            url = '../player.html?p=' + player + '&url=' + url;
        }
    }
    parent.content.location = url;
}

function commonCycle(str) {

    y = {
        initStr : str,
        cbegin : '',
        cend : '',
        currentStep : '',
        levels : []
    }
    cycles = str.split(scrollerConf.delimiterCycles);
    for(i=0;i<cycles.length;i++) {
        c = cycles[i].split(scrollerConf.delimiterCycle);
        if(c.length < 3) { continue; }
        y.levels[i] = {
            ctype : c[0],
            cbegin : parseInt(c[1]),
            cincrement : parseInt(c[2]),
            cend : (c.length > 3) ? parseInt(c[3]) : scrollerConf.nullEnd
        };
        y.levels[i].currentStep = y.levels[i].cbegin;
        y.currentStep += commonPadWithDelimiter(i, y.levels[i].currentStep, scrollerConf.delimiterSteps);
        
        y.cbegin += ((i>0) ? scrollerConf.delimiterSteps : '') + y.levels[i].cbegin;
        y.cend += ((i>0) ? scrollerConf.delimiterSteps : '') + y.levels[i].cend;
        
    };
    return y;
    
}

function commonInt2Date(dateAsInt) {
    d = dateAsInt;
    dateAsArray = [0,0,0];
    dateAsArray[2] = d%100;
    d = Math.floor(d/100);
    dateAsArray[1] = d%100;
    dateAsArray[0] = Math.floor(d/100);
    date = new Date(dateAsArray[0],dateAsArray[1]-1,dateAsArray[2] ,0,0,0,0);
    /*
    date = new Date();
    date.setFullYear(dateAsArray[0]);
    date.setMonth(dateAsArray[1]-1);
    date.setDate(dateAsArray[2]);
    */
    return date;
}

function commonDateNext(dateAsInt, direction) {
    date = commonInt2Date(dateAsInt);
    date.setTime(date.getTime() + (direction * 86400000));
    return date;
}

function commonDate2Int(date) {
    return date.getFullYear()*10000 + (date.getMonth()+1)*100 + date.getDate();
}

function commonIncrementCycle(cycleObj, i, direction) {
    
    // incrementing integer
    if(cycleObj.levels[i].ctype == scrollerConf.typeInt) {
        cycleObj.levels[i].currentStep = cycleObj.levels[i].currentStep + (direction * cycleObj.levels[i].cincrement);
    }
    
    // incrementing date
    if(cycleObj.levels[i].ctype == scrollerConf.typeDate) {
        cycleObj.levels[i].currentDate = commonDateNext(cycleObj.levels[i].currentStep,  (direction * cycleObj.levels[i].cincrement));
        cycleObj.levels[i].currentStep = commonDate2Int(cycleObj.levels[i].currentDate);
    }
    
    if(cycleObj.levels[i].cend != scrollerConf.nullEnd) {
        if(cycleObj.levels[i].currentStep > cycleObj.levels[i].cend) {
            cycleObj.levels[i].currentStep = cycleObj.levels[i].cbegin;
            cycleObj.levels[i].nextLevelDirection = direction;
        }
        if(cycleObj.levels[i].currentStep < cycleObj.levels[i].cbegin) {
            cycleObj.levels[i].currentStep = cycleObj.levels[i].cend;
            cycleObj.levels[i].nextLevelDirection = direction;
        }
    }
    return cycleObj;
}

function commonNext(cycle, step, url, direction) {

    cycleObj = commonCycle(cycle);
    cyclesLength = cycleObj.levels.length;

    if(step != null) {
    
        astep = step.split(scrollerConf.delimiterSteps);
        
        for(i=0; i<cyclesLength; i++) {
            y.levels[i].currentStep = parseInt(astep[i]);
        }
        
        if(direction != 0) {
            for(i=cyclesLength-1; i>-1; i--) {
                // last cycle
                if(i == cyclesLength-1) {
                    cycleObj = commonIncrementCycle(cycleObj, i, direction);
                } else {
                    if(cyclesLength>1 && cycleObj.levels[i+1].nextLevelDirection != null) {
                        cycleObj = commonIncrementCycle(cycleObj, i, cycleObj.levels[i+1].nextLevelDirection);
                    }
                }
            }
        }
        
    }
    
    m = url.match(/\{\d+:[^\}]*\}/g);
    if(m != null && m.length > 0) {
        for(i=0;i<m.length;i++) {
            placeholder = cleanPlaceholder(m[i]);
            placeholderParams = placeholder.split(scrollerConf.delimiterPlaceholder);
            
            cycleNo = parseInt(placeholderParams[0]);
            currentValue = cycleObj.levels[cycleNo].currentStep;
            if(placeholderParams.length > 2) {
                for(additionalParam = 2; additionalParam<placeholderParams.length; additionalParam++) {
                    eVal='';
                    if(placeholderParams[additionalParam].substr(0,5) == "eval ") {
                        x = currentValue;
                        eval(placeholderParams[additionalParam].substr(5));
                        currentValue = eVal;
                    }
                }
            }
            
            // replacing integer
            if(cycleObj.levels[cycleNo].ctype == scrollerConf.typeInt) {
                filler = '' + currentValue;
                if(placeholderParams[1] != '') {
                    filler = commonLeftPad(filler,parseInt(placeholderParams[1]),'0');
                }
            }
            
            // replacing date
            if(cycleObj.levels[cycleNo].ctype == scrollerConf.typeDate) {
                filler = placeholderParams[1];
                currentDate = commonInt2Date(cycleObj.levels[i].currentStep);
                
                // Template PHP's date()'s subset, see
                // http://php.net/manual/en/function.date.php
                filler = filler.replace('Y', currentDate.getFullYear());
                filler = filler.replace('y', 
                    commonLeftPad(currentDate.getFullYear()%100,2,'0'));
                filler = filler.replace('m', commonLeftPad(currentDate.getMonth()+1,2,'0'));
                filler = filler.replace('n', currentDate.getMonth() +1);
                filler = filler.replace('j', currentDate.getDate());
                filler = filler.replace('d', commonLeftPad(currentDate.getDate(),2,'0'));
                filler = filler.replace('w', currentDate.getDay());
            }
            
            url = url.replace(m[i],filler);
        }
    }
    
    cycleObj.nextStep = '';
    for(i=0; i<cyclesLength; i++) {
        cycleObj.nextStep += commonPadWithDelimiter(i, cycleObj.levels[i].currentStep, scrollerConf.delimiterSteps);
    }
    
    cycleObj.nextUrl = url;
    return cycleObj;
}


function commonLeftPad(str,len,padder) {
    str = '' + str;
    y = str;
    for(var i=0;i<len-str.length;i++) {
        y = padder + y;
    }
    return y;
}

function cleanPlaceholder(str) {
    return str.replace(scrollerConf.placeholder0,'').replace(scrollerConf.placeholder1,'');
}


function commonPopulate(cycleObj) {
    panelform = commonPanelForm();
    panelform.elements['step'].value = cycleObj.nextStep;
    panelform.elements['c'].value = cycleObj.initStr;
    panelform.elements['currenturl'].value = cycleObj.nextUrl;
    commonChangeContent(cycleObj.nextUrl);
}

function commonURL2Hash (url) {
    hashMap = {};
    searchBegin = url.indexOf('?');
    if(searchBegin > -1) {
       search = url.substr(searchBegin + 1);
       searchA = search.split("&");
       for(i=0;i<searchA.length;i++) {
            eq = searchA[i].indexOf('=');
            hashMap[searchA[i].substr(0,eq)] = decodeURIComponent(searchA[i].substr(eq + 1));
       }
    }
    return hashMap;
}

function commonNewWindow(cycle, url, step) {
    if(cycle == '' || url == '') {
        return true;
    }
    window.open(webRoot 
        + 'index.html?c='
        + encodeURIComponent(cycle)
        + (step!=null ? '&step=' + step : '')
        + '&u='
        + encodeURIComponent(url));
    return true;
}