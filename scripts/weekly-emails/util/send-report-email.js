const SibApiV3Sdk = require('sib-api-v3-sdk')

const generateHtmlContent = require('./generateHtmlContent')

require('dotenv').config({ path: '../../../.env' })

const defaultClient = SibApiV3Sdk.ApiClient.instance
const apiKey = defaultClient.authentications['api-key']
apiKey.apiKey =
  process.env.SENDINBLUE_API_KEY

const sendReportEmail = (name, email, follows, dryRun) => {
  try {
    const date = new Date().toISOString().split('T')[0]

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail() // SendSmtpEmail | Values to send a transactional email
    sendSmtpEmail = {
      sender: {
        email: 'notifications@nyc311.app',
        name: 'NYC 311 Reports'
      },
      to: [
        {
          email,
          name
        }
      ],
      subject: 'Weekly NYC 311 Report for Areas You Follow',
      textContent: 'Here is a summary of recent 311 activity for the areas you follow on nyc311.app',
      htmlContent: generateHtmlContent(date, name, email, follows)
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
