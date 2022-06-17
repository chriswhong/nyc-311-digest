// retreives an area-of-interest geometry from the database
import getDatabaseClient from './getDatabaseClient'

const queryDatabase = async (client) => {
  try {
    const db = client.db('nyc-311-digest')
    const cursor = await db.collection('custom-geometries').aggregate([{
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: 'sub',
        as: 'owner'
      }
    },
    {
      $project: {
        id: '$id',
        name: '$name',
        geometry: '$geometry',
        bbox: '$bbox',
        area: '$area',
        owner: { $first: '$owner' },
        followers: '$followers'
      }
    }]).sort({ area: -1 })
    const results = await cursor.toArray()

    // transform into a valid geojson FeatureCollection
    const FC = {
      type: 'FeatureCollection',
      features: results.map(({
        _id,
        name,
        geometry,
        bbox,
        area,
        owner,
        followers
      }) => {
        // add a dummy owner to orphaned AOIs
        let theOwner = owner
        if (!theOwner) {
          theOwner = {
            _id: '12345',
            username: 'Anonymous',
            sub: '12345'
          }
        }
        return {
          type: 'Feature',
          properties: {
            _id,
            name,
            bbox,
            area,
            owner: theOwner,
            followers: followers || {
              weekly: []
            }
          },
          geometry
        }
      })

    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Allow from anywhere
      },
      body: JSON.stringify(FC)
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
  context.callbackWaitsForEmptyEventLoop = false
  const client = await getDatabaseClient()
  return queryDatabase(client)
}
