// 出典:
// https://dev.classmethod.jp/articles/api-gateway-iam-authentication-sigv4/
// https://nodejs.org/api/http.html#httprequesturl-options-callback

const core = require('aws-sdk/lib/core')
const aws = require('aws-sdk')
const https = require('https')
require('dotenv').config()

const generateOptions = ({ serviceName, region, url, headers, bodyJson }) => {
  const options = {
    headers: {
      ...headers,
      'Content-Length': Buffer.byteLength(bodyJson),
    },
    body: bodyJson,
  }

  // URLからホスト、パス、クエリストリングを抽出
  const urlObj = new URL(url)
  const host = urlObj.host
  const path = urlObj.pathname
  const querystring = urlObj.search.slice(1)

  // V4クラスのコンストラクタの引数に沿う形でoptionsを作成
  const now = new Date()
  options.headers.host = host
  options.pathname = () => path
  options.methodIndex = 'post'
  options.search = () => (querystring ? querystring : '')
  options.region = region
  options.method = 'POST'

  // V4クラスのインスタンスを作成
  const signer = new core.Signers.V4(options, serviceName)

  // SigV4署名
  const accessKey = process.env.AWS_ACCESS_KEY_ID
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY
  const credential = new aws.Credentials(accessKey, secretKey)
  signer.addAuthorization(credential, now)

  return options
}

const httpsRequest = (url, options, bodyJson) => {
  // AWSにhttpsリクエスト
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

module.exports = ({ serviceName, region, url, headers, body }) => {
  const bodyJson = JSON.stringify(body)
  const options = generateOptions({ serviceName, region, url, headers, bodyJson })
  httpsRequest(url, options, bodyJson)
}
