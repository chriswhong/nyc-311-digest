// group 311 'complaint type' into higher-level categories
const getRollupCategory = (complaintType) => {
  let rollupCategory = complaintType

  if ([
    'Smoking',
    'Tattooing',
    'Drinking'
  ].includes(complaintType)) {
    rollupCategory = 'Noise & Nuisance'
  }

  if (complaintType.includes('Noise')) {
    rollupCategory = 'Noise & Nuisance'
  }

  if ([
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
    'Obstruction'
  ].includes(complaintType)) {
    rollupCategory = 'Streets & Sidewalks'
  }

  if ([
    'Dirty Condition',
    'Illegal Dumping',
    'Missed Collection',
    'Rodent',
    'UNSANITARY CONDITION',
    'Street Sweeping Complaint',
    'Dead Animal'
  ].includes(complaintType)) {
    rollupCategory = 'Sanitation & Cleanliness'
  }

  if ([
    'Food Establishment',
    'Consumer Complaint',
    'Day Care',
    'Outdoor Dining',
    'Food Poisoning'

  ].includes(complaintType)) {
    rollupCategory = 'Business/Consumer'
  }

  if ([
    'HEAT/HOT WATER',
    'PLUMBING',
    'General Construction/Plumbing',
    'FLOORING/STAIRS',
    'Water System',
    'Maintenance or Facility',
    'Building/Use',
    'WATER LEAK'

  ].includes(complaintType)) {
    rollupCategory = 'Housing & Buildings'
  }

  if ([
    'Panhandling',
    'Encampment',
    'Homeless Person Assistance'
  ].includes(complaintType)) {
    rollupCategory = 'Homeless/Assistance'
  }

  if ([
    'Illegal Parking',
    'For Hire Vehicle Complaint',
    'Broken Parking Meter',
    'Abandoned Vehicle',
    'Taxi Complaint'
  ].includes(complaintType)) {
    rollupCategory = 'Vehicular/Parking'
  }

  return rollupCategory
}

export default getRollupCategory
