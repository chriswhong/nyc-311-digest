// `weekly-reports` rand prior to this script, creating screenshots for all areas of interest that have followers
// next we will generate an email for each user who follows one or more area of interest, and embed the images in them

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const getUserEmails = require('./util/get-user-emails')
const sendReportEmail = require('./util/send-report-email')

require('dotenv').config({ path: '../../.env' })

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

(async () => {
  // get all users who follow one or more area
  console.log('fetching users who follow at least one area...')
  const usersWithFollows = await fetch(`${BASE_URL}/.netlify/functions/get-users-with-follows`).then(d => d.json())

  console.log('fetching email addresses from auth0 for each user...')
  // combine users with their follow ids with emails from auth0
  const usersWithFollowsPlusEmails = await getUserEmails(usersWithFollows)

  console.log('sending an email to each user with a report image...')
  for (let i = 0; i < usersWithFollowsPlusEmails.length; i += 1) {
    const { username, email, follows } = usersWithFollowsPlusEmails[i]

    console.log(`sending a report remail to ${username} <${email}> for ${follows.length} area${follows.length !== 1 ? 's' : ''}...`)

    sendReportEmail(username, email, follows)
  }
})()
