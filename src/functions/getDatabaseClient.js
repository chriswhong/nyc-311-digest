import { MongoClient } from 'mongodb'

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
// const DB_NAME = 'nyc-311-digest'

const getDatabaseClient = async () => {
  const client = await new MongoClient(MONGODB_URI, {
    useUnifiedTopology: true
  })

  await client.connect()

  return client
}

export default getDatabaseClient
