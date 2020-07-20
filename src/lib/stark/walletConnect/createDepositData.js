const prepareAmount = require('dvf-utils').prepareAmount

module.exports = async (dvf, starkProvider, token, amount) => {
  amount = prepareAmount(amount, dvf.token.maxQuantizedDecimalPlaces(token))
  const starkKey = starkProvider.starkPublicKey
  const tempVaultId = dvf.config.DVF.tempStarkVaultId
  const starkVaultId = await dvf.getVaultId(token)
  const currency = dvf.token.getTokenInfo(token)
  const nonce = dvf.util.generateRandomNonce()
  let starkTokenId = currency.starkTokenId
  const quantizedAmount = new BN(dvf.token.toQuantizedAmount(token, amount))
  const expireTime =
    Math.floor(Date.now() / (1000 * 3600)) +
    parseInt(dvf.config.defaultStarkExpiry)

  const starkSignature = await starkProvider.transfer(starkVaultId, tempVaultId, starkTokenId, quantizedAmount, nonce, expireTime)
  const starkMessage = dvf.stark.createTransferMessage(quantizedAmount,nonce,quantizedAmount,starkTokenId,starkVaultId,starkKey, expireTime)

  return {
    token,
    amount,
    nonce,
    starkPublicKey,//convert to r and s
    starkSignature,
    starkVaultId,
    expireTime
  }
}
