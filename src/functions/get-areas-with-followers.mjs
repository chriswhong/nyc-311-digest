// retreives an area-of-interest geometry from the database
import getDatabaseClient from './getDatabaseClient'

const queryDatabase = async (client) => {
  try {
    const db = client.db('nyc-311-digest')
    const cursor = await db.collection('follows')
      .aggregate([
        {
          $match: { 'followers.weekly': { $exists: true, $not: { $size: 0 } } }
        },
        {
          $project: {
            type: '$type',
            id: '$id'
          }
        }

      ])
    const results = await cursor.toArray()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // Allow from anywhere
      },
      body: JSON.stringify(results)
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
