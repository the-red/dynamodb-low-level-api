#!/usr/bin/env node

// 出典: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.RequestFormat

import { post } from './awsLowLevelApi'

type Request = {
  TableName: string
  Key: {
    AnimalType: { S: string }
    Name: { S: string }
  }
}
type Response = {
  Item: {
    AnimalType: { S: string }
    Name: { S: string }
  }
}

post<Request, Response>({
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
}).then((data) => {
  console.log(data)
})
