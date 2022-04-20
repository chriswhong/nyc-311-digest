// deletes an area of interest from the database
import getDatabaseClient from './getDatabaseClient'
import { requireAuth, handleOptionsCall } from './auth'

const queryDatabase = async (body, client) => {
  const db = client.db('nyc-311-digest')
  const response = await db.collection('custom-geometries')
    .deleteOne({
      _id: body.id
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
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  context.callbackWaitsForEmptyEventLoop = false
  const client = await getDatabaseClient()
  const body = JSON.parse(event.body)
  return queryDatabase(body, client)
}))
