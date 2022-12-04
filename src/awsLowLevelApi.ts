// 出典:
// https://dev.classmethod.jp/articles/api-gateway-iam-authentication-sigv4/

// @ts-expect-error
import { Signers } from 'aws-sdk/lib/core'
import aws from 'aws-sdk'
import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import dotenv from 'dotenv'
dotenv.config()

type Props<D> = {
  serviceName: string
  region: string
  url: string
  headers: Record<string, string>
  body: D
}

const generateOptions = <D>({ serviceName, region, url, headers, body }: Props<D>) => {
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
  const signer = new Signers.V4(options, serviceName)
  // SigV4署名
  signer.addAuthorization(credential, now)

  return options
}

export const post = async <Request, Response>(props: Props<Request>) => {
  try {
    const options = generateOptions<Request>(props)
    const res = await axios<Response, AxiosResponse<Response, Request>, Request>(props.url, {
      ...options,
      data: props.body,
    })
    return res.data
  } catch (e) {
    const error = e as AxiosError
    console.error(error.response?.data ?? error)
  }
}
