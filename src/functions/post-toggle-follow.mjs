
import getDatabaseClient from './getDatabaseClient'
import { requireAuth, handleOptionsCall } from './auth'

const queryDatabase = async ({ type, id, sub }, client) => {
  const db = client.db('nyc-311-digest')
  const followRecord = await db.collection('follows')
    .findOne({
      type,
      id
    })

  if (followRecord) {
    const { _id, followers } = followRecord
    let { weekly } = followers
    // append or remove this user
    const index = weekly.findIndex(d => d === sub)

    if (index === -1) {
      weekly = [
        ...weekly,
        sub
      ]
    } else {
      weekly.splice(index, 1)
    }

    await db.collection('follows').updateOne({
      _id
    }, {
      $set: { 'followers.weekly': weekly }
    })
  } else {
    // create a document with this user as the only follower
    await db.collection('follows').insertOne({
      type,
      id,
      followers: {
        weekly: [sub]
      }
    })
  }

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

  // check that body.sub === identitycontext.claims.sub
  if (body.sub !== context.identityContext.claims.sub) {
    return { statusCode: 400, body: 'invalid request' }
  }

  console.log(`owner ${body.sub} matches token, proceeding...`)

  return queryDatabase(body, client)
}))
