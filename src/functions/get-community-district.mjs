import communityDistricts from './data/community-districts.json'
import getDatabaseClient from './getDatabaseClient'

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }
  const id = parseInt(event.queryStringParameters.id)
  const communityDistrict = communityDistricts.features.find((d) => d.properties.BoroCD === parseInt(id))

  // append followers from database
  const client = await getDatabaseClient()
  const db = client.db('nyc-311-digest')
  const followRecord = await db.collection('follows').findOne({
    type: 'cd',
    id
  })

  if (followRecord) {
    communityDistrict.properties.followers = followRecord.followers
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allow from anywhere
    },
    body: JSON.stringify(communityDistrict)
  }
}
