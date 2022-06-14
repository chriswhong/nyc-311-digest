const fetch = require('node-fetch')
const puppeteer = require('puppeteer')
const fs = require('fs')

const dir = `${__dirname}/tmp`
if (fs.existsSync(dir)) {
  fs.rmdirSync(dir, { recursive: true })
}

fs.mkdirSync(dir);

(async () => {
  // get all AOI ids with followers
  const AOIIds = await fetch('http://localhost:8888/.netlify/functions/get-aois-with-followers').then(d => d.json())

  // initialize puppeteer
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  page.setViewport({ width: 550, height: 680 })

  for (let i = 0; i < AOIIds.length; i += 1) {
    const id = AOIIds[i]
    await page.goto(`http://localhost:8888/report-image/${id}`, { waitUntil: 'networkidle0' })

    await page.waitForSelector('.recharts-text.recharts-label')

    await page.screenshot({ path: `${__dirname}/tmp/${id}.png` })
  }

  await browser.close()
})()
