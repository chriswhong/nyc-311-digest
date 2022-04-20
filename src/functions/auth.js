import { NetlifyJwtVerifier } from '@serverless-jwt/netlify'

export const requireAuth = NetlifyJwtVerifier({
  issuer: process.env.JWT_ISSUER,
  audience: process.env.JWT_AUDIENCE
})

export const handleOptionsCall = (handler) => async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
  }

  if (!['POST', 'DELETE'].includes(event.httpMethod)) {
    return {
      statusCode: 200,
      headers
    }
  }
  // Continue.
  return handler(event, context)
}
