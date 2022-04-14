// check if the username exists in the database
import getDatabaseClient from './getDatabaseClient'
import { handleOptionsCall } from './auth'

const queryDatabase = async (body, client) => {
  const db = client.db('nyc-311-digest')
  const cursor = await db.collection('users')
    .find({
      username: body.username
    })
  const results = await cursor.toArray()

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow from anywhere
    },
    body: JSON.stringify({
      usernameAvailable: results.length === 0
    })
  }
}

exports.handler = handleOptionsCall(async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  context.callbackWaitsForEmptyEventLoop = false
  const client = await getDatabaseClient()
  const body = JSON.parse(event.body)
  return queryDatabase(body, client)
})
