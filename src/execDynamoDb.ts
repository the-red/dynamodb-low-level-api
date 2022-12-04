// 出典: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.RequestFormat

import { inspect } from 'util'
import { post } from './awsLowLevelApi'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

post({
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
    Key: marshall({
      AnimalType: 'Dog',
      Name: 'Fido',
    }),
  },
}).then(async (res) => {
  const body = await res.body.json()
  let unmarshalled
  try {
    unmarshalled = unmarshall(body?.Item)
  } catch {
    unmarshalled = {}
  }
  console.log(
    inspect(
      {
        statusCode: res.statusCode,
        data: body,
        unmarshalled,
      },
      { colors: true, depth: Infinity }
    )
  )
})
