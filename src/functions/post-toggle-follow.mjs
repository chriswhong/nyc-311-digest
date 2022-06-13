
import getDatabaseClient from './getDatabaseClient'
import { requireAuth, handleOptionsCall } from './auth'

const queryDatabase = async ({ _id, sub }, client) => {
  const db = client.db('nyc-311-digest')

  const AOI = await db.collection('custom-geometries')
    .findOne({
      _id
    })

  console.log('here', AOI)

  let followers = AOI.followers?.weekly
  console.log(followers)
  if (followers) {
    const index = followers.findIndex(d => d === sub)
    console.log('theIndex', index)

    if (index === -1) {
      followers = [
        ...followers,
        sub
      ]
    } else {
      followers.splice(index, 1)
    }
  } else {
    followers = [sub]
  }

  console.log('followers', followers)

  await db.collection('custom-geometries').updateOne({
    _id
  }, {
    $set: { 'followers.weekly': followers }
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

  // check that body.sub === identitycontext.claims.sub
  if (body.sub !== context.identityContext.claims.sub) {
    return { statusCode: 400, body: 'invalid request' }
  }

  console.log(`owner ${body.sub} matches token, proceeding...`)

  return queryDatabase(body, client)
}))
