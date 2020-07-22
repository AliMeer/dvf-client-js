const post = require('../../lib/dvf/post-authenticated')

module.exports = async (dvf, { nonce, signature }) => {
  const starkKey = dvf.config.wcStarkProvider.starkPublicKey.substr(2)

  const endpoint = '/v1/trading/w/register'

  const data = {
    starkKey,
    nonce,
    signature
  }
  console.log({ data })
  const userRegistered = await post(dvf, endpoint, nonce, signature, data)
  console.log({ userRegistered })
  if (userRegistered.isRegistered) {
    return userRegistered
  }

  try {
    if (userRegistered.deFiSignature) {
      const onchainRegister = await dvf.config.wcStarkProvider.register(
        userRegistered.deFiSignature
      )
      console.log({ onchainRegister })

      if (onchainRegister) {
        return dvf.getUserConfig(nonce, signature)
      }
    }
  } catch (e) {
    console.log('error in register method ', e)
    return false
  }
}
