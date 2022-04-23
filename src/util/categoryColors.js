/*
 The high-level categories are logical groupings of the 311 complaint_type
 field.  These were created specifically for this app to simplify reporting/charting
 and are defined in this file.

 complaint_type values that are not in one of the categories defined here will
 show up as their own top-level category and shown in gray on the map and chart.

 The maintainers of this app will attempt to add uncategorized complaint_type values
 to these categories from time to time
*/

const DEFAULT_CATEGORY_COLOR = '#C0C0BF'

const rollupCategories = [
  {
    id: 'noiseAndNuisance',
    displayName: 'Noise & Nuisance',
    color: '#fbb4ae',
    complaintTypes: [
      'Smoking',
      'Tattooing',
      'Drinking',
      'Drug Activity',
      'Illegal Fireworks',
      'Unleashed Dog'
    ]
  },
  {
    id: 'streetsAndSidewalks',
    displayName: 'Streets & Sidewalks',
    color: '#b3cde3',
    complaintTypes: [
      'Street Condition',
      'Traffic Signal Condition',
      'Sidewalk Condition',
      'Street Light Condition',
      'Damaged Tree',
      'Sewer',
      'Street Sign - Missing',
      'Blocked Driveway',
      'Curb Condition',
      'Traffic',
      'Illegal Tree Damage',
      'Obstruction',
      'New Tree Request',
      'Overgrown Tree/Branches',
      'Dead/Dying Tree',
      'Root/Sewer/Sidewalk Condition',
      'Bus Stop Shelter Complaint',
      'Graffiti'
    ]
  },
  {
    id: 'sanitationAndEnvironmental',
    displayName: 'Sanitation & Environmental',
    color: '#ccebc5',
    complaintTypes: [
      'Dirty Condition',
      'Illegal Dumping',
      'Missed Collection',
      'Rodent',
      'UNSANITARY CONDITION',
      'Street Sweeping Complaint',
      'Dead Animal',
      'Commercial Disposal Complaint',
      'Residential Disposal Complaint',
      'Unsanitary Pigeon Condition',
      'Hazardous Materials',
      'Air Quality',
      'Lead',
      'Water Conservation',
      'Asbestos',
      'Litter Basket Request'
    ]
  },
  {
    id: 'businessConsumer',
    displayName: 'Business/Consumer',
    color: '#decbe4',
    complaintTypes: [
      'Food Establishment',
      'Consumer Complaint',
      'Day Care',
      'Outdoor Dining',
      'Food Poisoning',
      'Mobile Food Vendor',
      'Green Taxi Complaint',
      'Taxi Report'
    ]

  },
  {
    id: 'housingBuildings',
    displayName: 'Housing & Buildings',
    color: '#fed9a6',
    complaintTypes: [
      'HEAT/HOT WATER',
      'PLUMBING',
      'General Construction/Plumbing',
      'FLOORING/STAIRS',
      'Water System',
      'Maintenance or Facility',
      'Building/Use',
      'WATER LEAK',
      'DOOR/WINDOW',
      'PAINT/PLASTER',
      'ELECTRIC',
      'GENERAL',
      'APPLIANCE',
      'ELEVATOR',
      'SAFETY',
      'School Maintenance',
      'Elevator',
      'Real Time Enforcement',
      'Boilers',
      'Emergency Response Team (ERT)',
      'BEST/Site Safety',
      'Plumbing'
    ]
  },
  {
    id: 'homelessAssistance',
    displayName: 'Homeless/Assistance',
    color: '#fddaec',
    complaintTypes: [
      'Panhandling',
      'Encampment',
      'Homeless Person Assistance'
    ]
  },
  {
    id: 'vehicularParking',
    displayName: 'Vehicular/Parking',
    color: '#e5d8bd',
    complaintTypes: [
      'Illegal Parking',
      'For Hire Vehicle Complaint',
      'Broken Parking Meter',
      'Abandoned Vehicle',
      'Taxi Complaint',
      'Derelict Vehicles',
      'Abandoned Bike',
      'Lost Property',
      'Found Property'
    ]
  }
]

// maps raw complaint_type from NYC 311 data to a category
const getRollupCategory = (complaintType) => {
  let rollupCategory = complaintType

  rollupCategories.forEach(({ displayName, complaintTypes }) => {
    if (complaintTypes.includes(complaintType)) {
      rollupCategory = displayName
    }
  })

  // special catch-all for noise
  if (complaintType.includes('Noise')) {
    rollupCategory = 'Noise & Nuisance'
  }

  return rollupCategory
}

// adds clusterProperties indicating whether all complaints in a cluster are the same category
// if so they will be filled with that category's color. Mixed clustters will be filled with gray
export const generateClusterProperties = () => {
  const clusterProperties = {}
  rollupCategories.forEach(({ id, displayName }) => {
    clusterProperties[`all_${id}`] = ['all', ['==', ['get', 'rollupCategory'], displayName], 'false']
  })

  return clusterProperties
}

// circle-color style rules for individual complaints
export const generateCircleCategoryColorStyle = () => {
  return [
    'match',
    ['get', 'rollupCategory'],
    ...rollupCategories.reduce((prev, curr) => {
      return [...prev, curr.displayName, curr.color]
    }, []),
    /* other */ DEFAULT_CATEGORY_COLOR
  ]
}

// circle-color style rules for clusters based on the `all_${id}` properties defined in generateClusterProperties()
export const generateClusterCategoryColorStyle = () => {
  return [
    'case',
    ...rollupCategories.reduce((prev, curr) => {
      return [...prev, ['get', `all_${curr.id}`], curr.color]
    }, []),
    /* other */ DEFAULT_CATEGORY_COLOR
  ]
}

// get color for a category displayName
export const getColorFromRollupCategory = (displayName) => {
  const match = rollupCategories.find(d => d.displayName === displayName)
  return match?.color || DEFAULT_CATEGORY_COLOR
}

export default getRollupCategory
