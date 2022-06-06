const bbox = require('@turf/bbox').default
const fs = require('fs')

const rawdata = fs.readFileSync('./community-districts.geojson')
const communityDistricts = JSON.parse(rawdata)

const FCWithFeatureBounds = {
  ...communityDistricts,
  features: communityDistricts.features
    .filter((d) => {
      return ![164, 226, 227, 228, 355, 356, 480, 481, 482, 483, 484].includes(d.properties.BoroCD)
    })
    .map((d) => {
      const bounds = bbox(d)
      return {
        ...d,
        properties: {
          ...d.properties,
          borocode: Math.floor(d.properties.BoroCD / 100 % 10),
          cdNumber: Math.floor(d.properties.BoroCD % 100),
          bbox: bounds
        }
      }
    })
}

fs.writeFileSync('../../public/data/community-districts.geojson', JSON.stringify(FCWithFeatureBounds))
