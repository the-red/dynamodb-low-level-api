# DynamoDB low-level API with Node.js

## Usage

1. Create DynamoDB table according to [official documentation](
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.RequestFormat)  
> Suppose that you have a table named `Pets`, with a key schema consisting of `AnimalType` (partition key) and `Name` (sort key). Both of these attributes are of type `string`.
<img width="693" alt="CleanShot 2022-12-04 at 23 19 30@2x" src="https://user-images.githubusercontent.com/4494300/205495837-8ce9cc27-343e-464a-b649-b7b52e2e9c52.png">

2. Create IAM ACCESS_KEY_ID and SECRET_ACCESS_KEY

3. Setup
```shell
git clone https://github.com/the-red/dynamodb-low-level-api.git
cd dynamodb-low-level-api

cp .env.example .env
# Set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` to .env

yarn install
```

4. Execute
```shell
yarn run dynamodb
```
