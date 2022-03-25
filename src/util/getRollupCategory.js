// group 311 'complaint type' into higher-level categories
const getRollupCategory = (complaintType) => {
  let rollupCategory = complaintType

  if ([
    'Smoking',
    'Tattooing',
    'Drinking',
    'Drug Activity',
    'Illegal Fireworks'
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
    'Obstruction',
    'New Tree Request',
    'Overgrown Tree/Branches',
    'Dead/Dying Tree',
    'Root/Sewer/Sidewalk Condition',
    'Bus Stop Shelter Complaint',
    'Graffiti'
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
    'Dead Animal',
    'Commercial Disposal Complaint',
    'Residential Disposal Complaint'
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
    'Boilers'
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
    'Taxi Complaint',
    'Derelict Vehicles',
    'Abandoned Bike',
    'Lost Property',
    'Found Property'
  ].includes(complaintType)) {
    rollupCategory = 'Vehicular/Parking'
  }

  return rollupCategory
}

export default getRollupCategory
