const SibApiV3Sdk = require('sib-api-v3-sdk')

require('dotenv').config({ path: '../../../.env' })

const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey =
  process.env.SENDINBLUE_API_KEY

const sendReportEmail = (name, email, follows) => {
  try {
    const date = new Date().toISOString().split('T')[0]
    const imgTags = follows.map(id => {
      return `<img src = 'https://nyc-311-reports-images.nyc3.digitaloceanspaces.com/${date}/${id}.png'>`
    }).join('')

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail() // SendSmtpEmail | Values to send a transactional email
    sendSmtpEmail = {
      sender: { email: 'notifications@nyc311.app' },
      to: [
        {
          email,
          name
        }
      ],
      subject: 'Weekly 311 Report',
      textContent: 'Test Email Content',
      htmlContent: `<html><head></head><body>${imgTags}</body></html>`
    }
    apiInstance.sendTransacEmail(sendSmtpEmail).then(
      function (data) {
        console.log('API called successfully. Returned data: ' + data)
      },
      function (error) {
        console.error(error)
      }
    )
  } catch (e) {
    console.log(`An error occured when sending an email to ${name} - <${email}>`)
  }
}

module.exports = sendReportEmail
