const ManagementClient = require('auth0').ManagementClient

require('dotenv').config({ path: '../../.env' })

const management = new ManagementClient({
  domain: 'nyc-311-reports.us.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'read:users'
})

const getUserEmails = async (usersWithFollows) => {
  try {
    const subs = usersWithFollows.map(d => d.sub).join(' ')
    const auth0Users = await management.getUsers({
      search_engine: 'v3',
      q: `user_id:(${subs})`
    })

    console.log('here', auth0Users.length)

    const usersWithFollowsPlusEmails = usersWithFollows.map((user) => {
      const match = auth0Users.find((d) => d.user_id === user.sub)
      if (!match) {
        console.log(`could not find auth0 email for ${user.username} - ${user.sub}`)
        return null
      }
      const { email } = match

      return {
        ...user,
        email
      }
    })
      .filter(d => d !== null)

    return usersWithFollowsPlusEmails
  } catch (e) {
    console.log('An error occured when getting auth0 user emails', e)
  }
}

module.exports = getUserEmails
