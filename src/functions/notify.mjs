import { IncomingWebhook } from '@slack/webhook'

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL)

// Initialize
export const fireSlackWebhook = async (text) => {
  console.log(`firing slack webhook using URL ${process.env.SLACK_WEBHOOK_URL}`)
  return await webhook.send({
    text
  })
}
