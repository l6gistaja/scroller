var webRoot = '';

$(document).ready(function()
{
  $.ajax({
    type: "GET",
    url: "xml/index.xml",
    dataType: "xml",
    success: parseIndex
  });
});

var cycleSave = false;
var cycleBegin = -1;

var cycleCoordinates = [];

function parseIndex(xml)
{
  var select = document.getElementById("f");
  hm = commonURL2Hash(location.href);
  $(xml).find("f").each(function()
  {
    var el = document.createElement("option");
    el.textContent = $(this).attr("src");
    el.value = $(this).attr("src");
    if("f" in hm && hm['f'] == $(this).attr("src")) {
        el.selected = true;
    }
    select.appendChild(el);
  });
}

function refreshBench() {
    
    url = $("#url").val();
    urlSlices = '';
    for(i=0;i<url.length;i++) {
        urlSlices += '<a href="#" title="Click to determine cycles begin and end" onclick="return c('
            + i
            + ');">'
            + url.charAt(i)
            + '</a>';
    }
    
    cycleCoordinates = [];
    $("#cycle").val('');
    $("#xml").val('');
    $("#template").val('');
    //$("#comment").val('');
    $("#searchresults").html('');
    $("#urlpicker").html(urlSlices);
    
    return true;
}

function c(i) {

    url = $("#url").val();
    
    if(cycleSave) {
        
        var oldCycle = $("#cycle").val();
        
        cc = {};
        cc['begin'] = cycleBegin;
        cc['end'] = i;
        cc['zeropad'] = $('#zeropad').is(':checked') ?1 :0;
        
        if(cc['end'] < cc['begin']) {
            var temp = cc['begin'];
            cc['begin'] = cc['end'];
            cc['end'] = temp;
        }
        cycleCoordinates[cycleCoordinates.length] = cc;
        
        placeholder = url.substring(cycleCoordinates[cycleCoordinates.length-1].begin,
                cycleCoordinates[cycleCoordinates.length-1].end+1);
        
        cycle = scrollerConf.typeInt
            + scrollerConf.delimiterCycle
            + (cycleCoordinates[cycleCoordinates.length-1].zeropad
                ? placeholder.replace(/^0+/,'')
                : placeholder)
            + scrollerConf.delimiterCycle
            + "1";
        
        $("#cycle").val(
            oldCycle
            + ($.trim(oldCycle) == '' ? '' : scrollerConf.delimiterCycles)
            + cycle);
            
        var begin = 0;
        var template = '';
        for(j=0;j<cycleCoordinates.length;j++) {
            template += url.substring(begin,cycleCoordinates[j].begin);
            template += scrollerConf.placeholder0
                + j
                + scrollerConf.delimiterPlaceholder
                + (cycleCoordinates[j].zeropad
                    ? 1 + cycleCoordinates[j].end - cycleCoordinates[j].begin
                    : '')
                + scrollerConf.placeholder1;
            begin = cycleCoordinates[j].end + 1;
        }
        template += url.substring(cycleCoordinates[cycleCoordinates.length-1].end+1);
        $("#template").val(template);
        
        cycleSave = false;
    } else {
        cycleBegin = i;
        cycleSave = true;
    }
    return true;
}

function xmlBench() {
    $("#xml").val( 
            '<p c="'
            + xmlizeBench($("#cycle").val())
            + '" u="'
            + xmlizeBench($("#template").val())
            + '"'
            + ($('#earliest').is(':checked') ? ' earliest=""' : '')
            + ($('#latest').is(':checked') ? ' latest=""' : '')
            + (($.trim($("#comment").val()) == '')
                ? '/>'
                : '>'
                    + xmlizeBench($("#comment").val())
                    + '</p>'
              )
           );
   return true;
}

function xmlizeBench(str) {
    return str.replace(/&/g,'&amp;');
}

function searchBench() {

    if($.trim($("#template").val()) == '') {
        $("#searchresults").html('Generate URL template before searching.');
        return true;
    }
    
    var pathfile = $("#f").val();
    $.ajax({
        type: "GET",
        url: "xml/" + pathfile,
        dataType: "xml",
        success: searchBenchAjax
    });
   
   return true;
}

function searchBenchAjax(xml) {

  var searchresults = '';
  var templateA = $("#template").val().split(scrollerConf.placeholder0);
  
  var index = 0;
  $(xml).find("p").each(function()
  {
    var urltemplate = $(this).attr("u");
    var uta = urltemplate.split(scrollerConf.placeholder0);
    if(uta[0] == templateA[0]) {
        searchresults = searchresults + '<tr><td><input type="button" onclick="return testSearcResultBench('
            + index
            + ');" value="Test"/>&nbsp;<input type="text" id="sr_c_'
            + index
            + '" size="10" value="'
            + $(this).attr("c")
            + '"/></td><td id="sr_u_'
            + index
            + '">'
            + $(this).attr("u")
            + '</td></tr>';
        index++;
    }
  });
  
  if(searchresults == '') {
    searchresults = 'Template '
        + $("#template").val()
        + " wasn't found in <a href=\"xml/"
        + $("#f").val()
        + '">'
        + $("#f").val()
        + '</a>.';
  } else {
    var tableheader = '<tr><th align="left">Cycle</th><th align="left">URL</th></tr>';
    searchresults = 'Template '
        + $("#template").val()
        + " was <strong>FOUND</strong> "
        + index
        + " times in <a href=\"xml/"
        + $("#f").val()
        + '">'
        + $("#f").val()
        + '</a>:<br/><br/><table>'
        + tableheader
        + searchresults
        + tableheader
        + '</table>';
  }
  
  $("#searchresults").html(searchresults);
}

function testBench() {
    return commonNewWindow($("#cycle").val(), $("#template").val(),null);
}

function testSearcResultBench(rowno) {
    return commonNewWindow($("#sr_c_"+rowno).val(), $("#sr_u_"+rowno).html(),null);
}