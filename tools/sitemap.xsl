<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml">
            <head>
                <title>XML Sitemap</title>
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <style type="text/css">
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 13px;
                        color: #545353;
                    }
                    table {
                        border: none;
                        border-collapse: collapse;
                    }
                    #sitemap tr:nth-child(odd) td {
                        background-color: #f8f8f8 !important;
                    }
                    #sitemap tbody tr:hover td {
                        background-color: #fff;
                    }
                    #sitemap tbody tr:hover td, #sitemap tbody tr:hover td a {
                        color: #000;
                    }
                    .expl {
                        margin: 18px 3px;
                        line-height: 1.2em;
                    }
                    .expl a {
                        color: #da3114;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div id="content">
                    <h1>XML Sitemap</h1>
                    <table id="sitemap" cellpadding="3">
                        <thead>
                            <tr>
                                <th width="75%">URL</th>
                                <th width="10%">Priority</th>
                                <th width="15%">Last Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="sitemap:urlset/sitemap:url">
                                <tr>
                                    <td>
                                        <xsl:variable name="itemURL">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </xsl:variable>
                                        <a href="{$itemURL}">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </a>
                                    </td>
                                    <td>
                                        <xsl:value-of select="sitemap:priority"/>
                                    </td>
                                    <td>
                                        <xsl:value-of select="sitemap:lastmod"/>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>