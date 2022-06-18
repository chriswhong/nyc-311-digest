const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

require('dotenv').config({ path: '../../.env' })

// create/clear tmp directory
const dir = path.join(__dirname, 'tmp')
if (fs.existsSync(dir)) {
  fs.rmSync(dir, { recursive: true })
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL
const IMAGE_WIDTH = 550
const IMAGE_HEIGHT = 680

fs.mkdirSync(dir);

(async () => {
  // get type and id for all areas with followers
  console.log('fetching areas of interest that have followers...')
  const areasWithFollowers = await fetch(`${BASE_URL}/.netlify/functions/get-areas-with-followers`).then(d => d.json())

  // initialize puppeteer
  console.log('initializing puppeteer...')

  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    args: [
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox',
      '--no-first-run',
      '--no-sandbox',
      '--no-zygote',
      '--single-process' // <- this one doesn't works in Windows
    ]
  })
  const page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0)
  page.setViewport({ width: IMAGE_WIDTH, height: IMAGE_HEIGHT })

  for (let i = 0; i < areasWithFollowers.length; i += 1) {
    const { type, id } = areasWithFollowers[i]
    console.log(`fetching report image for ${id}...`)

    // load the report-image view for this AOI
    const url = `${BASE_URL}/report-image/${type}/${id}`
    console.log(`loading ${url}`)
    await page.goto(url, { waitUntil: 'networkidle0' })

    await page.waitForTimeout(10000)

    // create a png
    const filePath = path.join(__dirname, 'tmp', `${id}.png`)
    await page.screenshot({ path: filePath })
    console.log(`saved to ${filePath}`)
  }

  await browser.close()
})()
