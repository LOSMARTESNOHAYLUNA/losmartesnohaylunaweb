<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sm">
<xsl:output method="html" encoding="UTF-8" indent="yes"/>
<xsl:template match="/">
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sitemap — Los Martes No Hay Luna</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8f6f2; color: #2a1f38; }
    header { background: #3a1c57; padding: 2rem 3rem; display: flex; align-items: center; gap: 1.5rem; }
    header h1 { color: #fff; font-size: 1.4rem; font-weight: 700; }
    header span { font-size: .8rem; color: rgba(255,255,255,.5); }
    .badge { background: #87B229; color: #2a1f38; font-size: .65rem; font-weight: 700; padding: .3rem .8rem; letter-spacing: .1em; text-transform: uppercase; }
    main { max-width: 1100px; margin: 2.5rem auto; padding: 0 1.5rem 4rem; }
    .meta { font-size: .82rem; color: #7a6f85; margin-bottom: 2rem; background: #fff; border-left: 3px solid #87B229; padding: .8rem 1.2rem; }
    table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 2px 12px rgba(88,45,129,.08); }
    thead { background: #582D81; color: #fff; }
    th { padding: 1rem 1.4rem; font-size: .72rem; letter-spacing: .12em; text-transform: uppercase; text-align: left; font-weight: 600; }
    td { padding: .9rem 1.4rem; font-size: .85rem; border-bottom: 1px solid rgba(88,45,129,.08); vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f4f0fa; }
    td a { color: #582D81; text-decoration: none; word-break: break-all; }
    td a:hover { color: #87B229; text-decoration: underline; }
    .priority { display: inline-block; padding: .2rem .6rem; font-size: .72rem; font-weight: 700; border-radius: 2px; }
    .p-high { background: #87B229; color: #2a1f38; }
    .p-mid { background: #e8f0d4; color: #2a1f38; }
    .p-low { background: #f0ecf7; color: #7a6f85; }
    .count { font-size: .78rem; color: #7a6f85; margin-bottom: 1rem; }
    footer { text-align: center; font-size: .72rem; color: #7a6f85; padding: 2rem; }
    /* Sitemap index styles */
    .sitemap-list { display: grid; gap: 1rem; margin-top: 1.5rem; }
    .sitemap-card { background: #fff; border-left: 4px solid #582D81; padding: 1.2rem 1.5rem; box-shadow: 0 2px 8px rgba(88,45,129,.06); }
    .sitemap-card a { color: #582D81; font-weight: 600; text-decoration: none; font-size: 1rem; }
    .sitemap-card a:hover { color: #87B229; }
    .sitemap-card .sm-date { font-size: .72rem; color: #7a6f85; margin-top: .3rem; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Los Martes No Hay Luna</h1>
      <span>losmartesnohayluna.com</span>
    </div>
    <span class="badge">Sitemap XML</span>
  </header>
  <main>
    <xsl:choose>
      <!-- SITEMAP INDEX -->
      <xsl:when test="//sm:sitemapindex">
        <div class="meta">Este es el sitemap índice. Haz clic en cada sitemap para ver sus URLs.</div>
        <p class="count"><xsl:value-of select="count(//sm:sitemap)"/> sitemaps encontrados</p>
        <div class="sitemap-list">
          <xsl:for-each select="//sm:sitemap">
            <div class="sitemap-card">
              <a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a>
              <div class="sm-date">Última modificación: <xsl:value-of select="sm:lastmod"/></div>
            </div>
          </xsl:for-each>
        </div>
      </xsl:when>
      <!-- URL LIST -->
      <xsl:otherwise>
        <div class="meta"><xsl:value-of select="count(//sm:url)"/> URLs indexadas en este sitemap.</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>URL</th>
              <th>Última modificación</th>
              <th>Frecuencia</th>
              <th>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="//sm:url">
              <tr>
                <td><xsl:value-of select="position()"/></td>
                <td><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
                <td><xsl:value-of select="sm:lastmod"/></td>
                <td><xsl:value-of select="sm:changefreq"/></td>
                <td>
                  <xsl:choose>
                    <xsl:when test="sm:priority >= 0.8">
                      <span class="priority p-high"><xsl:value-of select="sm:priority"/></span>
                    </xsl:when>
                    <xsl:when test="sm:priority >= 0.6">
                      <span class="priority p-mid"><xsl:value-of select="sm:priority"/></span>
                    </xsl:when>
                    <xsl:otherwise>
                      <span class="priority p-low"><xsl:value-of select="sm:priority"/></span>
                    </xsl:otherwise>
                  </xsl:choose>
                </td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </xsl:otherwise>
    </xsl:choose>
  </main>
  <footer>© 2026 Los Martes No Hay Luna · Leganés, Madrid</footer>
</body>
</html>
</xsl:template>
</xsl:stylesheet>
