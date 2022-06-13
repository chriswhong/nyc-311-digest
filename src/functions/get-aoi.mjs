// retreives an area-of-interest geometry from the database
import getDatabaseClient from './getDatabaseClient'

const queryDatabase = async (id, client) => {
  try {
    const db = client.db('nyc-311-digest')
    const aoi = await db.collection('custom-geometries').findOne({ _id: id })
    if (!aoi) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Allow from anywhere
        },
        body: JSON.stringify({
          error: 'true',
          message: 'aoi id not found'
        })
      }
    }

    let theOwner = await client.db('nyc-311-digest')
      .collection('users')
      .findOne({ sub: aoi.owner })

    const { _id, name, bbox, geometry } = aoi

    if (!theOwner) {
      theOwner = {
        _id: '12345',
        username: 'Anonymous',
        sub: '12345'
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Allow from anywhere
      },
      body: JSON.stringify({
        type: 'Feature',
        properties: {
          _id,
          name,
          bbox,
          owner: theOwner
        },
        geometry
      })
    }
  } catch (err) {
    console.log(err) // output to netlify function log
  } finally {
    await client.close()
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { id } = event.queryStringParameters
  context.callbackWaitsForEmptyEventLoop = false
  const client = await getDatabaseClient()
  return queryDatabase(id, client)
}
