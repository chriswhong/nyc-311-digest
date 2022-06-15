// retreives an area-of-interest geometry from the database
import getDatabaseClient from './getDatabaseClient'

const queryDatabase = async (id, client) => {
  try {
    const db = client.db('nyc-311-digest')
    const cursor = await db.collection('custom-geometries').aggregate([
      {
        $match: { _id: id }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'owner',
          foreignField: 'sub',
          as: 'owner'
        }
      },
      {
        $lookup: {
          from: 'follows',
          localField: '_id',
          foreignField: 'id',
          as: 'followers'
        }
      },
      {
        $project: {
          id: '$id',
          name: '$name',
          geometry: '$geometry',
          bbox: '$bbox',
          owner: { $first: '$owner' },
          followers: { $first: '$followers.followers' }
        }
      }
    ])

    const [aoi] = await cursor.toArray()

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

    const { _id, name, bbox, geometry, owner, followers } = aoi

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
          type: 'aoi',
          name,
          bbox,
          owner,
          followers
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
