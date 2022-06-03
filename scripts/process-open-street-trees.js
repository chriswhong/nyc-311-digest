const fetch = require('node-fetch')
const fs = require('fs').promises

const getStreetTreesData = async () => {
  const fields = [
    'created_date',
    'latitude',
    'longitude'
  ]

  const openStreetTreesAPICall = `https://data.cityofnewyork.us/resource/erm2-nwe9.json?$select=${fields.join(',')}&$where=complaint_type='New Tree Request' AND status != 'Closed'&$LIMIT=100000`
  console.log(openStreetTreesAPICall)
  return await fetch(openStreetTreesAPICall).then(d => d.json())

  //   const additionalPages = true
  //   const offset = 0

  //   const treeRequests = []
  //   do {

  // treeRequests = [...treeRequests, ...results]
  // console.log(results.length)
  // additionalPages = results.length === 1000
  // offset += 1000
  //   } while (additionalPages)
}

(async () => {
  const { dataUpdatedAt } = await fetch(
    'https://data.cityofnewyork.us/api/views/metadata/v1/erm2-nwe9'
  ).then((d) => d.json())
  const treeRequests = await getStreetTreesData()
  console.log(treeRequests.length)
  const FC = {
    type: 'FeatureCollection',
    properties: {
      dataUpdatedAt
    },
    features: treeRequests.map(({
      created_date,
      latitude,
      longitude
    }) => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(parseFloat(longitude).toFixed(6)), parseFloat(parseFloat(latitude).toFixed(6))]
        },
        properties: {
          created_date
        }
      }
    })
  }
  fs.writeFile('../public/data/open-street-tree-requests.geojson', JSON.stringify(FC))
})()
