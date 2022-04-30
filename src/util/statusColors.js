const OPEN_STATUS_COLOR = '#53A258'
const CLOSED_STATUS_COLOR = '#7B52D7'

export const statusColorsMapStyle = [
  'match',
  ['get', 'status'],
  'Closed',
  CLOSED_STATUS_COLOR,
  /* other */ OPEN_STATUS_COLOR
]

export const statusColorsClusterMapStyle = [
  'case',
  ['get', 'all_open'],
  OPEN_STATUS_COLOR,
  ['get', 'all_closed'],
  CLOSED_STATUS_COLOR,
  '#C0C0BF'
]

export const getStatusColor = (status) => {
  return status === 'Closed' ? CLOSED_STATUS_COLOR : OPEN_STATUS_COLOR
}
