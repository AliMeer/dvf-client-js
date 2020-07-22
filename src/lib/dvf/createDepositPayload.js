const prepareAmount = require('dvf-utils').prepareAmount

module.exports = async (dvf, { token, amount }) => {
  amount = prepareAmount(amount, dvf.token.maxQuantizedDecimalPlaces(token))
  const starkKey = dvf.config.wcStarkProvider.starkPublicKey
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  const starkVaultId = await dvf.getVaultId(token)
  const currency = dvf.token.getTokenInfo(token)
  const nonce = dvf.util.generateRandomNonce()
  let starkTokenId = currency.starkTokenId
  const quantizedAmount = dvf.token.toQuantizedAmount(token, amount)
  const expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const to = {
    starkPublicKey: starkKey,
    vaultId: String(starkVaultId)
  }

  const tokenParams = {
    quantum: String(currency.quantization) || '',
    tokenAddress: currency.tokenAddress || ''
  }

  const starkSignature = await dvf.config.wcStarkProvider.transfer(
    to,
    String(tempVaultId),
    tokenParams,
    quantizedAmount,
    String(nonce),
    String(expireTime)
  )

  return {
    token,
    amount,
    nonce,
    starkPublicKey: {x: starkKey.substr(2)}, //convert to r and s
    starkSignature,
    starkVaultId,
    expireTime
  }
}
