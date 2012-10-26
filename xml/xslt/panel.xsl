<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Scroller panel</title>
<script src="../js/func_common.js"></script>
<script> webRoot = '../'; </script>
<script src="../js/func_panel.js"></script>
</head>
<body onload="return panelInit();">
<form name="panelform">

<input id="c" name="c" type="hidden"/>
<input id="u" name="u" type="hidden"/>
<input id="currenturl" name="currenturl" type="hidden"/>
<input id="rowno" name="rowno" type="hidden"/>

<input type="button" value="R" onclick="return panelScroll(0);" title="Repeat current step"/>
<input type="button" value="&lt;&lt;" onclick="return panelScroll(-1);" title="Step backwards"/>
<input id="step" name="step" type="text" size="10" title="Current step"/>
<input type="button" value="&gt;&gt;" onclick="return panelScroll(1);" title="Step forward"/>

<input type="button" value="?" onclick="return panelInfo();" title="Info about current step"/>
<input type="button" value="B" onclick="return bench();" title="Workbench for generating new path"/>
<input type="button" value="R" onclick="return panelRepeatPaths();" title="See paths"/>
<select id="f" name="f" onchange="return panelFileChange();" title="File/Category">
    <xsl:for-each select="files/f">
    <option><xsl:attribute name="value"><xsl:value-of select="@src"/></xsl:attribute><xsl:value-of select="@src"/></option>
    </xsl:for-each>
</select>
<input type="checkbox" id="innewwindow" name="innewwindow" title="Open paths in new window?"/>
<select id="p" name="p" title="Player for content">
    <option value="-">(no player)</option>
    <option value="img">image fitter</option>
    <option value="wm">Windows Media</option>
</select>
</form>
</body>
</html>

</xsl:template>

</xsl:stylesheet>