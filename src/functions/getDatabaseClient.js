import { MongoClient } from 'mongodb'

if (process.env.REACT_APP_API_BASE_URL.includes('localhost')) {
  require('dotenv').config()
}

const MONGODB_URI = process.env.MONGODB_URI

const getDatabaseClient = async () => {
  const client = await new MongoClient(MONGODB_URI, {
    useUnifiedTopology: true
  })

  await client.connect()

  return client
}

export default getDatabaseClient
