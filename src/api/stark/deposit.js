const { post } = require('request-promise')

module.exports = async (dvf, { token, amount }) => {
  const data = await dvf.createDepositPayload({ token, amount })
  console.log({ data })
  const quantizedAmount = dvf.token.toQuantizedAmount(token, data.amount)
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  const url = dvf.config.api + '/v1/trading/w/deposit'

  await dvf.contract.approve(token, dvf.token.toBaseUnitAmount(token, data.amount))

  const depositResponse = await post(url, { json: data })

  const currency = dvf.token.getTokenInfo(token)

  // for testing, to be removed after WiP is done
  const Token = {
    type: 'ETH',
    data: {
      quantum: '10'
    }
  }

  // console.log('about to call deposit ', quantizedAmount, Token, String(data.starkVaultId))
  const transactionHash = await dvf.config.wcStarkProvider.deposit(quantizedAmount, Token, String(data.starkVaultId))

  return { ...depositResponse, transactionHash }
}
