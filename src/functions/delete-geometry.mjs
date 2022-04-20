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

const getIsOwner = async (id, sub, client) => {
  const db = client.db('nyc-311-digest')
  const response = await db.collection('custom-geometries')
    .findOne({
      _id: id
    })

  return response.owner === sub
}

exports.handler = handleOptionsCall(requireAuth(async (event, context) => {
  if (event.httpMethod !== 'DELETE') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  context.callbackWaitsForEmptyEventLoop = false
  const client = await getDatabaseClient()
  const body = JSON.parse(event.body)

  // user must own the AOI or have admin rights
  const isAdmin = context.identityContext.claims.permissions.includes('write:area-of-interest:admin')
  const isOwner = await getIsOwner(body.id, context.identityContext.claims.sub, client)

  if (isAdmin || isOwner) {
    return queryDatabase(body, client)
  } else {
    return { statusCode: 401, body: 'Unauthorized' }
  }
}))
