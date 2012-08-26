<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
<title>Scroller panel</title>
<script src="../js/func_common.js"></script>
<script src="../js/func_panel.js"></script>
</head>
<body onload="return panelInit();">
<form name="panelform">

<input id="c" name="c" type="hidden"/>
<input id="u" name="u" type="hidden"/>
<input id="currenturl" name="currenturl" type="hidden"/>
<input id="rowno" name="rowno" type="hidden"/>

<input type="button" value="R" onclick="return panelScroll(0);"/>
<input type="button" value="&lt;&lt;" onclick="return panelScroll(-1);"/>
<input id="step" name="step" type="text" size="10"/>
<input type="button" value="&gt;&gt;" onclick="return panelScroll(1);"/>

<input type="button" value="?" onclick="return panelInfo();"/>
<input type="button" value="R" onclick="return panelRepeatPaths();"/>
<select id="f" name="f" onchange="return panelFileChange();">
    <xsl:for-each select="files/f">
    <option><xsl:attribute name="value"><xsl:value-of select="@src"/></xsl:attribute><xsl:value-of select="@src"/></option>
    </xsl:for-each>
</select>
</form>
</body>
</html>

</xsl:template>

</xsl:stylesheet>