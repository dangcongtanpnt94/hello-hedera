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

async function getBalance(client, contractId, accountId) {
  let tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(30000)
    .setFunction(
      'balanceOf',
      new ContractFunctionParameters().addAddress(
        accountId.toSolidityAddress(),
      ),
    )
    .execute(client)
  // const tx = await balance.execute(client)
  // const receipt = await tx.getReceipt(client)
  record = await tx.getRecord(client)
  balance = record.contractFunctionResult.getUint256(0)
  console.log('balance: ', balance)
  console.log('balance: ', balance.toString())
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
  // main -> createTx {"nodeId":"0.0.5","transactionHash":"7baf46d44768a39eb7214f69751c941a0b291c6ae4df48891980af6669b472d1f1cc2a5763dd3c1b470662e33faa1c01","transactionId":"0.0.48222958@1663167530.422270019"}
  contractId = '0.0.48241894'

  console.log('publickey: ', privateKey.publicKey.toStringDer())
  console.log('solidity address: ', privateKey)
  console.log('solidity address: ', privateKey.publicKey)
  console.log('solidity address: ', accountId.toSolidityAddress())


  await getBalance(client, contractId, accountId)

  // mint balance
  let tx = await new ContractExecuteTransaction()
    .setContractId(contractId)
    .setGas(100000)
    .setFunction(
      'mint',
      new ContractFunctionParameters()
        .addAddress(accountId.toSolidityAddress())
        .addUint256(696969696969),
    )
    .execute(client)

  receipt = await tx.getReceipt(client)

  console.log("=====================")
  console.log("=====================")
  await getBalance(client, contractId, accountId)
}

main()
