#!/usr/bin/env node

const request = require('./awsLowLevelApi')

request({
  serviceName: 'dynamodb',
  region: 'ap-northeast-1',
  url: 'https://dynamodb.ap-northeast-1.amazonaws.com',
  headers: {
    'Accept-Encoding': 'identity',
    'Content-Type': 'application/x-amz-json-1.0',
    'X-Amz-Target': 'DynamoDB_20120810.GetItem',
  },
  body: {
    TableName: 'Pets',
    Key: {
      AnimalType: { S: 'Dog' },
      Name: { S: 'Fido' },
    },
  },
})
