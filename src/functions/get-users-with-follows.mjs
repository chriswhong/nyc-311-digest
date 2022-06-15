// retreives an area-of-interest geometry from the database
import getDatabaseClient from './getDatabaseClient'

const queryDatabase = async (client) => {
  try {
    const db = client.db('nyc-311-digest')
    const cursor = await db.collection('users').aggregate([
      {
        $lookup: {
          from: 'follows',
          let: { userSub: '$sub' },
          pipeline: [
            {
              $match: { 'followers.weekly': { $exists: true, $not: { $size: 0 } } }
            },
            {
              $match: {
                $expr: {
                  $in: ['$$userSub', '$followers.weekly']
                }
              }
            },
            {
              $project: {
                _id: 0,
                id: '$id'
              }
            }
          ],
          as: 'follows'
        }
      }, {
        $match: { follows: { $not: { $size: 0 } } }
      },
      {
        $addFields: {
          follows: '$follows.id'
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
