// uses turf/area to calculate the area of each polygon and store it in the database
const { MongoClient } = require('mongodb')
const calculateArea = require('@turf/area').default
require('dotenv').config({ path: '../../.env' })
const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  const client = await new MongoClient(MONGODB_URI, {
    useUnifiedTopology: true
  })

  await client.connect()

  const db = client.db('nyc-311-digest')
  const aois = await db.collection('custom-geometries').find().toArray()

  for (let i = 0; i < aois.length; i += 1) {
    const aoi = aois[i]
    const area = calculateArea(aoi.geometry)
    aoi.area = area
    console.log(aoi)
    db.collection('custom-geometries').updateOne({ _id: aoi._id }, { $set: aoi })
  }
})()
