// group 311 'complaint type' into higher-level categories
const getRollupCategory = (rollupCategory) => {
  switch (rollupCategory) {
    case 'Noise & Nuisance':
      return '#fbb4ae'
    case 'Streets & Sidewalks':
      return '#b3cde3'
    case 'Sanitation & Environmental':
      return '#ccebc5'
    case 'Business/Consumer':
      return '#decbe4'
    case 'Housing & Buildings':
      return '#fed9a6'
    case 'Homeless/Assistance':
      return '#fddaec'
    case 'Vehicular/Parking':
      return '#e5d8bd'
    default:
      return 'gray'
  }
}

export default getRollupCategory
