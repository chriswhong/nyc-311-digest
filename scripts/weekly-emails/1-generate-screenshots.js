const fetch = require('node-fetch')
const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

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
  try {
    // get type and id for all areas with followers
    console.log('fetching areas of interest that have followers...')
    const areasWithFollowers = await fetch(`${BASE_URL}/.netlify/functions/get-areas-with-followers`).then(d => d.json())

    // initialize puppeteer
    console.log('initializing puppeteer...')

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    page.setViewport({ width: IMAGE_WIDTH, height: IMAGE_HEIGHT })

    for (let i = 0; i < areasWithFollowers.length; i += 1) {
      const { type, id } = areasWithFollowers[i]
      console.log(`fetching report image for ${id}...`)

      // load the report-image view for this AOI
      await page.goto(`${BASE_URL}/report-image/${type}/${id}`, { waitUntil: 'networkidle0' })

      // wait until the chart is loaded
      await page.waitForSelector('.recharts-text.recharts-label')

      // create a png
      const filePath = path.join(__dirname, 'tmp', `${id}.png`)
      await page.screenshot({ path: filePath })
      console.log(`saved to ${filePath}`)
    }

    await browser.close()
  } catch (e) {
    console.error('An error occurred during the generate screenshots step', e)
  }
})()
