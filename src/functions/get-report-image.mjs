// retreives an area-of-interest geometry from the database
import getDatabaseClient from './getDatabaseClient'

const queryDatabase = async (sub, client) => {
  try {
    const db = client.db('nyc-311-digest')
    const results = await db.collection('users').findOne({
      sub
    })

    if (results) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Allow from anywhere
        },
        body: JSON.stringify(results)
      }
    } else {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Allow from anywhere
        },
        body: JSON.stringify({ error: 'not found' })
      }
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
  const querystring = event.queryStringParameters
  const id = querystring.id
  console.log(id)

  return {
    statusCode: 200,

    body: id
  }
//   context.callbackWaitsForEmptyEventLoop = false
//   const client = await getDatabaseClient()
//   return queryDatabase(sub, client)
}
