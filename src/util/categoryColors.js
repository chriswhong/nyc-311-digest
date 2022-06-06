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
      'Drinking',
      'Drug Activity',
      'Illegal Fireworks',
      'Smoking',
      'Tattooing',
      'Unleashed Dog',
      'Urinating in Public',
      'Disorderly Youth'
    ]
  },
  {
    id: 'streetsAndSidewalks',
    displayName: 'Streets, Sidewalks, and Parks',
    color: '#b3cde3',
    complaintTypes: [
      'Animal in a Park',
      'Bike Rack Condition',
      'Bike/Roller/Skate Chronic',
      'Blocked Driveway',
      'Bus Stop Shelter Complaint',
      'Bus Stop Shelter Placement',
      'Curb Condition',
      'Damaged Tree',
      'Dead/Dying Tree',
      'Dumpster Complaint',
      'E-Scooter',
      'Graffiti',
      'Illegal Tree Damage',
      'New Tree Request',
      'Obstruction',
      'Overgrown Tree/Branches',
      'Poison Ivy',
      'Root/Sewer/Sidewalk Condition',
      'Sewer',
      'Sidewalk Condition',
      'Street Condition',
      'Street Light Condition',
      'Street Sign - Damaged',
      'Street Sign - Dangling',
      'Street Sign - Missing',
      'Traffic Signal Condition',
      'Traffic',
      'Uprooted Stump',
      'Violation of Park Rules',
      'Wood Pile Remaining'
    ]
  },
  {
    id: 'sanitationAndEnvironmental',
    displayName: 'Sanitation & Environmental',
    color: '#ccebc5',
    complaintTypes: [
      'Air Quality',
      'Asbestos',
      'Beach/Pool/Sauna Complaint',
      'Commercial Disposal Complaint',
      'Construction Lead Dust',
      'Dead Animal',
      'Dirty Condition',
      'Hazardous Materials',
      'Illegal Dumping',
      'Illegal Posting',
      'Indoor Air Quality',
      'Lead',
      'Litter Basket Complaint',
      'Litter Basket Request',
      'Missed Collection',
      'Mosquitoes',
      'Recycling Basket Complaint',
      'Residential Disposal Complaint',
      'Rodent',
      'Sanitation Worker or Vehicle Complaint',
      'Standing Water',
      'Street Sweeping Complaint',
      'Transfer Station Complaint',
      'Unsanitary Animal Pvt Property',
      'UNSANITARY CONDITION',
      'Unsanitary Pigeon Condition',
      'Water Conservation'
    ]
  },
  {
    id: 'businessConsumer',
    displayName: 'Business/Consumer',
    color: '#decbe4',
    complaintTypes: [
      'Consumer Complaint',
      'Day Care',
      'Food Establishment',
      'Food Poisoning',
      'Green Taxi Complaint',
      'Mobile Food Vendor',
      'Outdoor Dining',
      'Taxi Report',
      'X-Ray Machine/Equipment'
    ]

  },
  {
    id: 'housingBuildings',
    displayName: 'Housing & Buildings',
    color: '#fed9a6',
    complaintTypes: [
      'APPLIANCE',
      'BEST/Site Safety',
      'Boilers',
      'Building/Use',
      'Building Drinking Water Tank',
      'Cranes and Derricks',
      'DOOR/WINDOW',
      'Drinking Water',
      'ELECTRIC',
      'Electrical',
      'Elevator',
      'ELEVATOR',
      'Emergency Response Team (ERT)',
      'FLOORING/STAIRS',
      'General Construction/Plumbing',
      'GENERAL',
      'Harboring Bees/Wasps',
      'HEAT/HOT WATER',
      'Indoor Sewage',
      'Investigations and Discipline (IAD)',
      'Maintenance or Facility',
      'Mold',
      'Non-Residential Heat',
      'OUTSIDE BUILDING',
      'PAINT/PLASTER',
      'Plumbing',
      'PLUMBING',
      'Real Time Enforcement',
      'SAFETY',
      'Scaffold Safety',
      'School Maintenance',
      'Special Natural Area District (SNAD)',
      'Special Projects Inspection Team (SPIT)',
      'WATER LEAK',
      'Water System'

    ]
  },
  {
    id: 'homelessAssistance',
    displayName: 'Homeless/ Assistance/ Abuse / Police',
    color: '#fddaec',
    complaintTypes: [
      'Animal-Abuse',
      'Encampment',
      'Homeless Person Assistance',
      'Illegal Animal Kept as Pet',
      'Illegal Animal Sold',
      'Non-Emergency Police Matter',
      'Panhandling'

    ]
  },
  {
    id: 'vehicularParking',
    displayName: 'Vehicular/Parking',
    color: '#e5d8bd',
    complaintTypes: [
      'Abandoned Bike',
      'Abandoned Vehicle',
      'Broken Parking Meter',
      'Derelict Vehicles',
      'For Hire Vehicle Complaint',
      'For Hire Vehicle Report',
      'Found Property',
      'Illegal Parking',
      'Lost Property',
      'Taxi Complaint'
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
// if so they will be filled with that category's color. Mixed clusters will be filled with gray
export const generateClusterProperties = () => {
  const clusterProperties = {}
  rollupCategories.forEach(({ id, displayName }) => {
    clusterProperties[`all_${id}`] = ['all', ['==', ['get', 'rollupCategory'], displayName], 'false']
  })

  clusterProperties.all_closed = ['all', ['==', ['get', 'status'], 'Closed'], 'false']
  clusterProperties.all_open = ['all', ['!=', ['get', 'status'], 'Closed'], 'false']

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
