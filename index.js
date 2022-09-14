const {
  Client,
  PrivateKey,
  AccountCreateTransaction,
  Hbar,
  AccountBalanceQuery,
  AccountId
} = require('@hashgraph/sdk')
require('dotenv').config()

async function main() {
  const myAccountId = process.env.MY_ACCOUNT_ID
  const myPrivateKey = process.env.MY_PRIVATE_KEY

  if (myAccountId == null || myPrivateKey == null) {
    console.log('null')
  }

  const client = Client.forTestnet()
  client.setOperator(myAccountId, myPrivateKey)

  const newAccountPrivateKey = await PrivateKey.generateED25519()
  console.log('main -> newAccountPrivateKey', newAccountPrivateKey)
  console.log('main -> newAccountPrivateKey', newAccountPrivateKey.toStringDer())
  console.log('main -> newAccountPrivateKey', newAccountPrivateKey.toStringRaw())
  const newAccountPublicKey = newAccountPrivateKey.publicKey
  console.log('main -> newAccountPublicKey', newAccountPublicKey)
  console.log('main -> newAccountPublicKey', newAccountPublicKey.toStringDer())
  console.log('main -> newAccountPublicKey', newAccountPublicKey.toStringRaw())

  // create new account on testnet
  const newAccount = await new AccountCreateTransaction()
    .setKey(newAccountPublicKey)
    .setInitialBalance(Hbar.fromTinybars(1000))
    .execute(client)

  // get account ID after create
  const receipt = await newAccount.getReceipt(client)
  const newAccountId = receipt.accountId
  console.log('main -> newAccountId', newAccountId)
  console.log('main -> newAccountId', newAccountId.toString())
  console.log('main -> newAccountId', newAccountId.toSolidityAddress())

  const accountBalance = await new AccountBalanceQuery()
    .setAccountId(newAccountId)
    .execute(client)
  console.log('main -> accountBalance', accountBalance)
  console.log('main -> accountBalance', accountBalance.toString())
}

main()
