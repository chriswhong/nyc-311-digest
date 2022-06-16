const fs = require('fs').promises

const AWS = require('aws-sdk')

require('dotenv').config({ path: '../../.env' })

const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT)
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET
});

(async () => {
  // read the files list from ./tmp
  const filenames = await fs.readdir('./tmp')
  console.log(`pushing ${filenames.length} images to the space\`${process.env.DO_SPACES_NAME}\``)
  for (let i = 0; i < filenames.length; i += 1) {
    const file = await fs.readFile(`./tmp/${filenames[i]}`)
    const date = new Date().toISOString().split('T')[0]
    const filePath = `${date}/${filenames[i]}`
    const uploadParams = {
      Bucket: process.env.DO_SPACES_NAME,
      Key: filePath,
      Body: file,
      ACL: 'public-read'
    }

    s3.putObject(uploadParams, (err, data) => {
      if (err) return console.log(err)
      console.log(`${filePath} uploaded successfully!`, data)
    })
  }
})()
