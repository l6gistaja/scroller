<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
  <script src="../js/func_common.js"></script>
  <script src="../js/func_paths.js"></script>
  </head>
  <body>
  <table border="0" cellspacing="7">
    <tr>
      <th align="left" colspan="2"><a name="begin"><a href="#end">#</a></a></th>
      <th align="left">Cycle</th>
      <th align="left">URL</th>
    </tr>
    <xsl:for-each select="paths/p">
    <tr>
      <td valign="top" align="right"><a><xsl:attribute name="name">r<xsl:value-of select="position()"/></xsl:attribute><a title="Address of this cycle"><xsl:attribute name="href">#r<xsl:value-of select="position()"/></xsl:attribute><xsl:value-of select="position()"/></a></a>.</td>
      <td valign="top">
        <xsl:if test="@earliest and string-length(@earliest) > 0">
            <input type="button" value="&lt;" title="Earliest known step">
            <xsl:attribute name="onclick">return pCU('<xsl:value-of select="@c"/>','<xsl:value-of select="@u"/>',<xsl:value-of select="position()"/>,'<xsl:value-of select="@earliest"/>');</xsl:attribute>
            </input>&#160;
        </xsl:if>
        <xsl:if test="@latest and string-length(@latest) > 0">
            <input type="button" value=">" title="Latest known step">
            <xsl:attribute name="onclick">return pCU('<xsl:value-of select="@c"/>','<xsl:value-of select="@u"/>',<xsl:value-of select="position()"/>,'<xsl:value-of select="@latest"/>');</xsl:attribute>
            </input>&#160;
        </xsl:if>
        <xsl:value-of select="text()" disable-output-escaping="yes"/>
      </td>
      <td valign="top">
        <a href="#" title="Choose this cycle"><xsl:attribute name="onclick">return pCU('<xsl:value-of select="@c"/>','<xsl:value-of select="@u"/>',<xsl:value-of select="position()"/>,null);</xsl:attribute><xsl:value-of select="@c"/></a></td>
      <td valign="top"><xsl:value-of select="@u"/></td>
    </tr>
    </xsl:for-each>
    <tr>
      <th align="left" colspan="2"><a name="end"><a href="#begin">#</a></a></th>
      <th align="left">Cycle</th>
      <th align="left">URL</th>
    </tr>
  </table>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>