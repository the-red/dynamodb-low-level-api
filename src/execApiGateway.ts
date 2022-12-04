#!/usr/bin/env node

import request from './awsLowLevelApi'

request({
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
})
