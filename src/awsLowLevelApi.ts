// 出典:
// https://dev.classmethod.jp/articles/api-gateway-iam-authentication-sigv4/
// https://nodejs.org/api/http.html#httprequesturl-options-callback

import core from 'aws-sdk/lib/core'
import aws from 'aws-sdk'
import https from 'https'
import dotenv from 'dotenv'
dotenv.config()

type RequestBody = any
type Props = {
  serviceName: string
  region: string
  url: string
  headers: Record<string, string>
  body: RequestBody
}

const generateOptions = ({ serviceName, region, url, headers, body }: Props) => {
  const bodyJson = JSON.stringify(body)

  // URLからホスト、パス、クエリストリングを抽出
  const urlObj = new URL(url)
  const host = urlObj.host
  const path = urlObj.pathname
  const querystring = urlObj.search.slice(1)

  const options = {
    headers: {
      ...headers,
      'Content-Length': Buffer.byteLength(bodyJson),
      host,
    },

    body: bodyJson,
    pathname: () => path,
    methodIndex: 'post',
    search: () => (querystring ? querystring : ''),
    region: region,
    method: 'POST',
  }

  const accessKey = process.env.AWS_ACCESS_KEY_ID!
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY!
  const credential = new aws.Credentials(accessKey, secretKey)
  const now = new Date()
  // @ts-expect-error
  const signer = new core.Signers.V4(options, serviceName)
  // SigV4署名
  signer.addAuthorization(credential, now)

  return options
}

const httpsRequest = ({
  url,
  options,
  body,
}: {
  url: string
  options: Parameters<typeof https.request>[1]
  body: RequestBody
}) => {
  // AWSにhttpsリクエスト
  const bodyJson = JSON.stringify(body)
  const req = https.request(url, options, (res) => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
    })
    res.on('end', () => {
      console.log('No more data in response.')
    })
  })

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`)
  })

  // Write data to request body
  req.write(bodyJson)
  req.end()
}

export default ({ serviceName, region, url, headers, body }: Props) => {
  const options = generateOptions({ serviceName, region, url, headers, body })
  httpsRequest({ url, options, body })
}
