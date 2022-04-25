import { IncomingWebhook } from '@slack/webhook'

const webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL)

// Initialize
export const fireSlackWebhook = async (text) => {
  return await webhook.send({
    text
  })
}
