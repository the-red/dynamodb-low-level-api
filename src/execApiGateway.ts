#!/usr/bin/env node

import { post } from './awsLowLevelApi'

type Request = Record<string, number>
type Response = any

post<Request, Response>({
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
}).then((data) => {
  console.log(data)
})
