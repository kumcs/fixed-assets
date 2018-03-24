<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
 <xsl:output omit-xml-declaration="yes"/>
 <xsl:template match="@*|node()">
  <xsl:copy>
   <xsl:apply-templates select="@*|node()"/>
  </xsl:copy>
 </xsl:template>
 <xsl:template match="translations">
  <xsl:apply-templates select="document('translations.xml')"/>
 </xsl:template>
 <xsl:template match="qm">
  <xsl:apply-templates select="node()"/>
 </xsl:template>
</xsl:stylesheet>
