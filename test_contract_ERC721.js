const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  AccountBalanceQuery,
  ContractCreateFlow,
  AccountId,
  ContractExecuteTransaction,
  ContractFunctionParameters,
} = require('@hashgraph/sdk')
require('dotenv').config()
const fs = require('fs')

async function getCounter(client, contractId) {
  let tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction('counter')
    .execute(client)
  record = await tx.getRecord(client)
  counter = record.contractFunctionResult.getUint256(0)
  console.log('last counter is: ', counter)
  return counter
}

async function getTokenURI(client, contractId, tokenId) {
  let tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction(
      'tokenURI',
      new ContractFunctionParameters().addUint256(tokenId),
    )
    .execute(client)
  const record = await tx.getRecord(client)
  tokenURI = record.contractFunctionResult.getString(0)
  return tokenURI
}

async function getOwnerOf(client, contractId, tokenId) {
  let tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction(
      'ownerOf',
      new ContractFunctionParameters().addUint256(tokenId),
    )
    .execute(client)
  const record = await tx.getRecord(client)
  owner = record.contractFunctionResult.getAddress(0)
  return owner
}

async function mint(client, contractId, accountId, uri) {
  let tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(1000000)
    .setFunction(
      'mint',
      new ContractFunctionParameters()
        .addAddress(accountId.toSolidityAddress())
        .addString(uri),
    )
    .execute(client)
  await tx.getReceipt(client)
}

async function main() {
  const myAccountId = process.env.MY_ACCOUNT_ID
  const myPrivateKey = process.env.MY_PRIVATE_KEY
  const privateKey = PrivateKey.fromString(myPrivateKey)
  const accountId = AccountId.fromString(myAccountId)
  if (myAccountId == null || myPrivateKey == null) {
    console.log('null')
  }

  const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey)
  contractId = '0.0.48251477'

  console.log('publickey: ', privateKey.publicKey.toStringDer())
  console.log('solidity address: ', privateKey)
  console.log('solidity address: ', privateKey.publicKey)
  console.log('solidity address: ', accountId.toSolidityAddress())

  // mint balance
  const uri =
    'https://r.fashionunited.com/r9oXfTRCNurkgXUMVROsUBT32vUqTG0NxeepWdGjUwc/resize:fill:1200:630:1/gravity:ce/quality:70/aHR0cHM6Ly9mYXNoaW9udW5pdGVkLmNvbS9pbWcvdXBsb2FkLzIwMjIvMDQvMjgvYXNpY3MtbmZ0LTNzNWl0bXRsLTIwMjItMDQtMjguanBlZw.jpeg'

  await mint(client, contractId, accountId, uri)

  const tokenId = await getCounter(client, contractId)
  console.log('main -> tokenId', tokenId)
  const tokenURI = await getTokenURI(client, contractId, tokenId)
  console.log('main -> tokenURI', tokenURI)

  const owner = await getOwnerOf(client, contractId, tokenId)
  console.log("main -> owner", owner)
  console.log('=====================')
  console.log('=====================')
}

main()
