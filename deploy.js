const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  AccountBalanceQuery,
  ContractCreateFlow,
} = require('@hashgraph/sdk')
require('dotenv').config()
const fs = require('fs')
async function main() {
  const myAccountId = process.env.MY_ACCOUNT_ID
  const myPrivateKey = process.env.MY_PRIVATE_KEY

  if (myAccountId == null || myPrivateKey == null) {
    console.log('null')
  }

  const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey)

  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(myAccountId)
    .execute(client)
  console.log('main -> accountBalance', accountBalance)
  console.log('main -> accountBalance', accountBalance.toString())


  const bytecode = fs.readFileSync('TestERC20.bin')

  const createContract = new ContractCreateFlow().setGas(1000000).setBytecode(bytecode)

  const createTx = await createContract.execute(client);
  console.log("main -> createTx", createTx)
  console.log("main -> createTx", createTx.toString())
  const createRx = await createTx.getReceipt(client);
  console.log("main -> createRx", createRx)
  console.log("main -> createRx", createRx.toString())
  const contractId = createRx.contractId;
  console.log("main -> contractId", contractId)
  console.log("main -> contractId", contractId.toString())

}

main()
