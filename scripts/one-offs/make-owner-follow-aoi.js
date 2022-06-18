// uses turf/area to calculate the area of each polygon and store it in the database
const { MongoClient } = require('mongodb')
require('dotenv').config({ path: '../../.env' })
const MONGODB_URI = process.env.MONGODB_URI;

(async () => {
  const client = await new MongoClient(MONGODB_URI, {
    useUnifiedTopology: true
  })

  await client.connect()

  const db = client.db('nyc-311-digest')
  const aois = await db.collection('custom-geometries').aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'owner',
        foreignField: 'sub',
        as: 'owner'
      }
    },
    {
      $lookup: {
        from: 'follows',
        localField: '_id',
        foreignField: 'id',
        as: 'followers'
      }
    },
    {
      $project: {
        id: '$id',
        name: '$name',
        owner: { $first: '$owner' },
        followers: { $first: '$followers.followers' }
      }
    }
  ]).toArray()

  for (let i = 0; i < aois.length; i += 1) {
    console.log(i)
    const aoi = aois[i]
    const ownerSub = aoi.owner.sub
    const followers = aoi.followers?.weekly || []
    if (followers.includes(ownerSub)) {
      console.log('Already follows')
    } else {
      const followRecord = await db.collection('follows')
        .findOne({
          type: 'aoi',
          id: aoi._id
        })

      if (followRecord) {
        const { _id, followers } = followRecord
        let { weekly } = followers
        // append or remove this user
        const index = weekly.findIndex(d => d === ownerSub)

        if (index === -1) {
          weekly = [
            ...weekly,
            ownerSub
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
          type: 'aoi',
          id: aoi._id,
          followers: {
            weekly: [ownerSub]
          }
        })
      }
    }
  }
})()
