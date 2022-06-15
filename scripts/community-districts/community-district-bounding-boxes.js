const bbox = require('@turf/bbox').default
const fs = require('fs')

const rawdata = fs.readFileSync('./community-districts.geojson')
const communityDistricts = JSON.parse(rawdata)

const capitalizeString = (str) => {
  return str[0].toUpperCase() + str.substring(1)
}

const parseBoroCD = (boroCD) => {
  const boroCode = Math.floor(boroCD / 100 % 10)
  const cdNumber = Math.floor(boroCD % 100)
  let boroName = ''
  switch (boroCode) {
    case 1:
      boroName = 'manhattan'
      break
    case 2:
      boroName = 'bronx'
      break
    case 3:
      boroName = 'brooklyn'
      break
    case 4:
      boroName = 'queens'
      break
    case 5:
      boroName = 'staten-island'
      break
  }

  return {
    boroCode,
    boroName,
    cdNumber
  }
}

const getCdName = (boroName, cdNumber) => {
  let prettifiedboroName = capitalizeString(boroName)

  if ((boroName) === 'staten-island') {
    prettifiedboroName = 'Staten Island'
  }

  return `${prettifiedboroName} Community District ${cdNumber}`
}
const FCWithFeatureBounds = {
  ...communityDistricts,
  features: communityDistricts.features
    .filter((d) => {
      return ![164, 226, 227, 228, 355, 356, 480, 481, 482, 483, 484].includes(d.properties.BoroCD)
    })
    .map((d) => {
      const bounds = bbox(d)
      const { boroCode, boroName, cdNumber } = parseBoroCD(d.properties.BoroCD)
      const name = getCdName(boroName, cdNumber)
      return {
        ...d,
        properties: {
          ...d.properties,
          boroCode,
          cdNumber,
          type: 'cd',
          _id: d.properties.BoroCD,
          bbox: bounds,
          name
        }
      }
    })
}

fs.writeFileSync('../../src/functions/data/community-districts.json', JSON.stringify(FCWithFeatureBounds))
