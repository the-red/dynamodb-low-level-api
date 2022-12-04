// 出典: https://dev.classmethod.jp/articles/api-gateway-iam-authentication-sigv4-aws-sdk-v3/

import dotenv from 'dotenv'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Sha256 } from '@aws-crypto/sha256-universal'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { request } from 'undici'
dotenv.config()

export const post = async <T = any>({
  serviceName,
  region,
  url,
  headers,
  body,
}: {
  serviceName: string
  region: string
  url: string
  headers: Record<string, string>
  body: T
}) => {
  const apiUrl = new URL(url)
  const signatureV4 = new SignatureV4({
    service: serviceName,
    region: region,
    credentials: defaultProvider(),
    sha256: Sha256,
  })
  const httpRequest = new HttpRequest({
    headers: {
      ...headers,
      host: apiUrl.hostname,
    },
    hostname: apiUrl.hostname,
    method: 'POST',
    path: apiUrl.pathname,
    body: JSON.stringify(body),
  })

  const signedRequest = await signatureV4.sign(httpRequest)

  return request(signedRequest)
}
