/**
 * Signs toSign assyncronously
 *
 * For more information, check:
 * https://web3js.readthedocs.io/en/1.0/web3-eth.html#sign
 */
const walletConnectTypes = ['walletConnect']

module.exports = (dvf, toSign) => {
  if (walletConnectTypes.includes(dvf.config.walletType)) {
    return dvf.config.wcStarkProvider.send("personal_sign", [toSign, dvf.get('account')])
  } else if (dvf.web3.currentProvider.isMetaMask) {
    return dvf.web3.eth.personal.sign(toSign, dvf.get('account'))
  } else {
    return dvf.web3.eth.sign(toSign, dvf.get('account'))
  }
}
