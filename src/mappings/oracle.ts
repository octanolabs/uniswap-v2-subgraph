/* eslint-disable prefer-const */
import { Oracle } from '../types/schema'
import { EthereumBlock, json, JSONValueKind } from '@graphprotocol/graph-ts'
import { BigDecimal, BigInt, Boolean } from '@graphprotocol/graph-ts/index'
import { exponentToBigDecimal } from './helpers'
import { ZERO_BD } from './helpers'

const XORACLE_ADDRESS = '0xaeff2f7644f1c615adb309513c4cb564f44bb68f' // created block 1322544

// dummy for testing
export function getEthPriceInUSD(): BigDecimal {
  // fetch price from market oracle
  let oracle = Oracle.load(XORACLE_ADDRESS)

  if (oracle !== null) {
    let data: BigInt = oracle.getPrice
    if (data !== null) {
      let usd = data.toBigDecimal()
      if (usd !== null) {
        usd = usd.div(exponentToBigDecimal(BigInt.fromI32(6)))
        return usd
      } else {
        return ZERO_BD
      }
    } else {
      return ZERO_BD
    }
  } else {
    return BigDecimal.fromString('0.2') // ZERO_BD
  }
}

export function handleBlock(block: EthereumBlock): void {
  let id = block.hash.toHex()
  let entity = new Oracle(id)
  entity.block = block.number
  entity.usd = getEthPriceInUSD()
  entity.save()
}
