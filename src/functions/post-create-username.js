// check if the username exists in the database
import getDatabaseClient from './getDatabaseClient'
import { requireAuth, handleOptionsCall } from './auth'

const queryDatabase = async (body, client) => {
  const db = client.db('nyc-311-digest')
  await db.collection('users')
    .insertOne({
      username: body.username,
      sub: body.sub
    })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow from anywhere
    },
    body: JSON.stringify({
      success: true
    })
  }
}

exports.handler = handleOptionsCall(requireAuth(async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  context.callbackWaitsForEmptyEventLoop = false
  const client = await getDatabaseClient()
  const body = JSON.parse(event.body)
  return queryDatabase(body, client)
}))
