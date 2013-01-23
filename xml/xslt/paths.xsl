<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></meta>
  <meta http-equiv="Pragma" content="no-cache"></meta>
  <meta http-equiv="Expires" content="-1"></meta>
  <script src="../js/libs/jquery/jquery-1.8.2.min.js"></script>
  <script src="../js/libs/jquery-ui-1.10.0.custom/js/jquery-ui-1.10.0.custom.min.js"></script>
  <link rel="stylesheet" href="../js/libs/jquery-ui-1.10.0.custom/css/smoothness/jquery-ui-1.10.0.custom.min.css" media="all" />
  <script src="../js/func_common.js"></script>
  <script> webRoot = '../'; </script>
  <script src="../js/func_paths.js"></script>
  </head>
  <body>
  <div id="dialog-modal" title="Generate downloader script" style="display: none;"></div>
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
        <a href="#" title="Generate download script" style="text-decoration: none;">
            <xsl:attribute name="onclick">Tgds(<xsl:value-of select="position()"/>);</xsl:attribute>
            <span class="ui-icon ui-icon-folder-open" style="display:inline-block;">D</span>
        </a>&#160;
        <xsl:if test="@earliest and string-length(@earliest) > 0">
            <a href="#" style="text-decoration: none;">
                <xsl:attribute name="onclick">return TpCU(<xsl:value-of select="position()"/>,'<xsl:value-of select="@earliest"/>');</xsl:attribute>
                <xsl:attribute name="title">Earliest known step: <xsl:value-of select="@earliest"/></xsl:attribute>
                <span class="ui-icon ui-icon-seek-start" style="display:inline-block;">&lt;</span>
            </a>&#160;
        </xsl:if>
        <xsl:if test="@latest and string-length(@latest) > 0">
            <a href="#" style="text-decoration: none;">
                <xsl:attribute name="onclick">return TpCU(<xsl:value-of select="position()"/>,'<xsl:value-of select="@latest"/>');</xsl:attribute>
                <xsl:attribute name="title">Latest known step: <xsl:value-of select="@latest"/></xsl:attribute>
                <span class="ui-icon ui-icon-seek-end" style="display:inline-block;">&gt;</span>
            </a>&#160;
        </xsl:if>
        <xsl:value-of select="text()" disable-output-escaping="yes"/>
      </td>
      <td valign="top">
        <a href="#" title="Choose this cycle"><xsl:attribute name="id">c<xsl:value-of select="position()"/></xsl:attribute><xsl:attribute name="onclick">return TpCU(<xsl:value-of select="position()"/>,null);</xsl:attribute><xsl:value-of select="@c"/></a></td>
      <td valign="top"><xsl:attribute name="id">u<xsl:value-of select="position()"/></xsl:attribute><xsl:value-of select="@u"/></td>
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