import getDatabaseClient from './getDatabaseClient'

const slugify = require('slugify')

const BASE_URL = 'https://nyc311.app'

const slugFromName = (name) => slugify(name || 'unnamed', { replacement: '-', lower: true })

const queryDatabase = async (client) => {
  try {
    const db = client.db('nyc-311-digest')
    const aois = await db.collection('custom-geometries')
      .find({}, { projection: { name: 1 } })
      .toArray()

    const staticUrls = [
      { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${BASE_URL}/community-districts`, priority: '0.8', changefreq: 'monthly' },
      { loc: `${BASE_URL}/areas`, priority: '0.8', changefreq: 'daily' }
    ]

    const aoiUrls = aois.map(({ _id, name }) => ({
      loc: `${BASE_URL}/report/aoi/${_id}/${slugFromName(name)}`,
      priority: '0.6',
      changefreq: 'daily'
    }))

    const allUrls = [...staticUrls, ...aoiUrls]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ loc, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')}
</urlset>`

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/xml' },
      body: xml
    }
  } catch (err) {
    console.log(err)
    return { statusCode: 500, body: 'Error generating sitemap' }
  } finally {
    await client.close()
  }
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false
  const client = await getDatabaseClient()
  return queryDatabase(client)
}
