
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
  $(xml).find("f").each(function()
  {
    var el = document.createElement("option");
    el.textContent = $(this).attr("src");
    el.value = $(this).attr("src");
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
    $("#comment").val('');
    $("#searchresults").html('');
    $("#urlpicker").html(urlSlices);
    
    return true;
}

function c(i) {

    url = $("#url").val();
    
    if(cycleSave) {
        
        var oldCycle = $("#cycle").val();
        
        cycleCoordinates[cycleCoordinates.length] = cycleBegin;
        cycleCoordinates[cycleCoordinates.length] = i;
        if(cycleCoordinates[cycleCoordinates.length-1] < cycleCoordinates[cycleCoordinates.length-2]) {
            var temp = cycleCoordinates[cycleCoordinates.length-1];
            cycleCoordinates[cycleCoordinates.length-1] = cycleCoordinates[cycleCoordinates.length-2];
            cycleCoordinates[cycleCoordinates.length-2] = temp;
        }
        
        cycle = scrollerConf.typeInt
            + scrollerConf.delimiterCycle
            + url.substring(cycleCoordinates[cycleCoordinates.length-2],
                cycleCoordinates[cycleCoordinates.length-1]+1)
            + scrollerConf.delimiterCycle
            + "1";
        $("#cycle").val(
            oldCycle
            + ($.trim(oldCycle) == '' ? '' : scrollerConf.delimiterCycles)
            + cycle);
            
        var begin = 0;
        var template = '';
        for(j=0;j<cycleCoordinates.length;j+=2) {
            template += url.substring(begin,cycleCoordinates[j]);
            template += scrollerConf.placeholder0
                + Math.floor(j/2)
                + scrollerConf.delimiterPlaceholder
                + scrollerConf.placeholder1;
            begin = cycleCoordinates[j+1] + 1;
        }
        template += url.substring(cycleCoordinates[cycleCoordinates.length-1]+1);
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
        alert('Generate URL template before searching.');
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
        + " was found in <a href=\"xml/"
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
    return testPageBench($("#cycle").val(), $("#template").val());
}

function testSearcResultBench(rowno) {
    return testPageBench($("#sr_c_"+rowno).val(), $("#sr_u_"+rowno).html());
}

function testPageBench(cycle, url) {
    if($.trim(cycle) == '' || $.trim(url) == '') {
        return true;
    }
    window.open('index.html?c='
        + encodeURIComponent(cycle)
        + '&u='
        + encodeURIComponent(url));
    return true;
}