// inserts a geometry into the database, returning its unique id

import getDatabaseClient from './getDatabaseClient'
import shortid from 'shortid'

const queryDatabase = async (body, client) => {
  const db = client.db('nyc-311-digest')
  const id = shortid.generate()
  await db.collection('custom-geometries')
    .insertOne({
      _id: id,
      name: body.name,
      geometry: body.geometry,
      bbox: body.bbox
    })

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow from anywhere
    },
    body: JSON.stringify({
      id
    })
  }
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  context.callbackWaitsForEmptyEventLoop = false
  const client = await getDatabaseClient()
  const body = JSON.parse(event.body)
  return queryDatabase(body, client)
}
