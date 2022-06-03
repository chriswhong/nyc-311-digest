const bbox = require('@turf/bbox').default
const fs = require('fs')

const rawdata = fs.readFileSync('./community-districts.geojson')
const communityDistricts = JSON.parse(rawdata)

const FCWithFeatureBounds = {
  ...communityDistricts,
  features: communityDistricts.features.map((d) => {
    const bounds = bbox(d)
    return {
      ...d,
      properties: {
        ...d.properties,
        bbox: bounds
      }
    }
  })
}

fs.writeFileSync('./community-districts-with-bounds.geojson', JSON.stringify(FCWithFeatureBounds))
