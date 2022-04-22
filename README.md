# nyc-311-digest

A web app for local 311 reporting.  Users can define a custom area of interest and explore 311 data clipped to that specific area.

## Why?

[NYC's 311 dataset](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9) is enormous and unruly.  [Analyses of the data are ubiquitous](nyc 311 charts and maps), but tend to exist along predefined municipal boundaries such as Neighborhood Tabulation Areas, Community Districts, Boroughs, and the city as a whole.  

Blocks, sets of blocks, corridors, and perceived neighborhood boundaries are more "human-scale", and the point of this app is to allow citizens to get/explore localized 311 data for the specific area they are interested in for situational awareness and light analysis, and to share these reports with their friends and neighbors.

A longer term goal of the project is to contribute to a "feedback loop" for 311 requests.  Engaged citizens who submit complaints in their neighborhoods can review their own requests in the 311 mobile app or website, but it is difficult to get a sense of what else has been going on nearby.  (The 311 website has a [citywide 311 request map](https://portal.311.nyc.gov/check-status/), but it is *not good*.)

I would like to add the ability to "subscribe" to a report and get a daily/weekly summary of new activity via email, with lots of sharing capabilities.  This can empower community groups, block associations, etc to get a sense of who is reporting what, and can coordinate their efforts to make sure priority issues are elevated.

Furthermore, these localized reports can be used to show elected officials and community boards what the trending issues are in certain places.

## Architecture

The frontend was made using create-react-app and makes use of tailwind for styling and layout, and mapboxgl for mapping.  State and data fetching is managed within the react components for now.

The backend uses netlify functions to read from and write to a mongodb atlas database.  The database stores the user-defined areas of interest.

311 data is pulled directly from the NYC Open Data portal in the user's browser.  Queries for custom polygons are not possible, so a bounding box for the area of interest is queried, then turf.js is used to do a points-in-polygon filter.  The resulting dataset is displayed in the app.

## Dev Environment

### Environment Variables

Create a `.env` file with the following variables:

- `MONGODB_URI` for the netlify functions to connect to the database
- `REACT_APP_API_BASE_URL=http://localhost:8888` 
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- `ESLINT_NO_DEV_ERRORS=true` makes create react app be less yelly

### Develop with netlify CLI

`netlify login`
`netlify link` 
`netlify dev`    
