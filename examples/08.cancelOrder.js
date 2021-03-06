#!/usr/bin/env node

const HDWalletProvider = require('truffle-hdwallet-provider')
const sw = require('starkware_crypto')
const Web3 = require('web3')

const DVF = require('../src/dvf')
const envVars = require('./helpers/loadFromEnvOrConfig')()


const ethPrivKey = envVars.ETH_PRIVATE_KEY
// NOTE: you can also generate a new key using:`
// const starkPrivKey = dvf.stark.createPrivateKey()
const starkPrivKey = ethPrivKey
const infuraURL = `https://ropsten.infura.io/v3/${envVars.INFURA_PROJECT_ID}`

const provider = new HDWalletProvider(ethPrivKey, infuraURL)
const web3 = new Web3(provider)
provider.engine.stop()

const dvfConfig = {
  // Using staging API.
  api: 'https://api.stg.deversifi.com'
  // Add more variables to override default values
}

;(async () => {
  const dvf = await DVF(web3, dvfConfig)

  let orderId
  const orders = await dvf.getOrders('ETH:USDT')

  console.log('orders', orders)

  if (orders.length == 0) {
    console.log('submitting new order')
    
    // Submit an order to buy 0.5 Eth at a rate of 200 USDT for 1 Eth
    const symbol = 'ETH:USDT'
    const amount = 0.5
    const price = 200
    const validFor = '0'
    const feeRate = ''

    const submitOrderResponse = await dvf.submitOrder({
      symbol,
      amount,
      price,
      starkPrivateKey: starkPrivKey,
      validFor,           // Optional
      feeRate,            // Optional
      gid: '1',           // Optional
      cid: '1',           // Optional
      partnerId: 'P1'    // Optional
    })

    console.log('submitOrder response ->', submitOrderResponse)

    orderId = submitOrderResponse._id
  }
  else {
    orderId = orders[0]._id
  }

  console.log('cancelling orderId', orderId)

  const response = await dvf.cancelOrder(orderId)

  console.log("cancelOrder response ->", response)

})()
.catch(error => {
  console.error(error)
  process.exit(1)
})

