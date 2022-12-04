#!/usr/bin/env node

// 出典: https://dev.classmethod.jp/articles/api-gateway-iam-authentication-sigv4/
const core = require('aws-sdk/lib/core')
const aws = require('aws-sdk')
require('dotenv').config()

// アクセスキーとシークレットアクセスキーを設定
const accessKey = process.env.AWS_ACCESS_KEY_ID
const secretKey = process.env.AWS_SECRET_ACCESS_KEY
const credential = new aws.Credentials(accessKey, secretKey)

main()

function main() {
  // サービス名は、API GatewayのAPIの場合は、execiute-api固定です。
  const serviceName = 'execute-api'

  // Signers.V4クラスのコンストラクタに渡すオプションを作成します。
  const request = {
    // api gatewayのURL
    url: 'https://XXXXXXXXX.execute-api.ap-northeast-1.amazonaws.com/dev/',
    headers: {},
  }

  // api gatewayのURLからホスト、パス、クエリストリングを抽出
  const parts = request.url.split('?')
  const host = parts[0].substr(8, parts[0].indexOf('/', 8) - 8)
  const path = parts[0].substr(parts[0].indexOf('/', 8))
  const querystring = parts[1]

  // V4クラスのコンストラクタの引数に沿う形でoptionsを作成
  const now = new Date()
  request.headers.host = host
  request.pathname = () => path
  request.methodIndex = 'post'
  request.search = () => (querystring ? querystring : '')
  request.region = 'ap-northeast-1'
  request.method = 'POST'

  // V4クラスのインスタンスを作成
  const signer = new core.Signers.V4(request, serviceName)

  // SigV4署名
  signer.addAuthorization(credential, now)

  //　署名されたヘッダーを出力
  console.log(request.headers)
}
