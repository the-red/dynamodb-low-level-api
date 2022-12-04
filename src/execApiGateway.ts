import { post } from './awsLowLevelApi'

post({
  serviceName: 'execute-api',
  region: 'ap-northeast-1',
  url: process.env.API_GATEWAY_URL!,
  headers: {
    'Content-Type': 'application/json',
  },
  body: {
    one: 1,
    two: 2,
    three: 3,
  },
}).then(async (res) => {
  console.log({
    statusCode: res.statusCode,
    body: await res.body.text(),
  })
})
