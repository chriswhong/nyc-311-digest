// Deletes an AOI from the database by its _id
// Usage: node delete-aoi.js <id>
const { MongoClient, ObjectId } = require('mongodb')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const MONGODB_URI = process.env.MONGODB_URI
const id = process.argv[2]

if (!id) {
  console.error('Usage: node delete-aoi.js <id>')
  process.exit(1)
}

// Support both ObjectId and shortid formats
const query = /^[a-f\d]{24}$/i.test(id) ? { _id: new ObjectId(id) } : { _id: id }

;(async () => {
  const client = new MongoClient(MONGODB_URI, { useUnifiedTopology: true })
  await client.connect()

  const db = client.db('nyc-311-digest')

  const aoi = await db.collection('custom-geometries').findOne(query)
  if (!aoi) {
    console.error(`No AOI found with id: ${id}`)
    await client.close()
    process.exit(1)
  }

  console.log(`Found: "${aoi.name}" (owner: ${aoi.owner})`)
  console.log('Deleting...')

  await db.collection('custom-geometries').deleteOne(query)
  console.log('Deleted.')

  await client.close()
})()
