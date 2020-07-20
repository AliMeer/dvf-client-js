const { post } = require('request-promise')

module.exports = async (dvf, starkProvider, token, amount) => {
  const data = dvf.stark.walletConnect.createDepositData(starkProvider, token, amount)
  const quantizedAmount = new BN(dvf.token.toQuantizedAmount(token, data.amount))
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  const url = dvf.config.api + '/v1/trading/w/deposit'

  console.log({ data })
  
  await dvf.contract.approve(token, dvf.token.toBaseUnitAmount(token, data.amount))

  const depositResponse = await post(url, { json: data })
  
  const transactionHash = await starkProvider.deposit(quantizedAmount, token, tempVaultId)

  return { ...depositResponse, transactionHash }
}
