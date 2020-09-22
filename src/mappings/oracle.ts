/* eslint-disable prefer-const */
import { Oracle } from '../types/schema'
import { EthereumBlock, json, JSONValueKind } from '@graphprotocol/graph-ts'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts/index'
import { exponentToBigDecimal } from './helpers'
import { ZERO_BD } from './helpers'

const XORACLE_ADDRESS = '0xaefF2F7644f1C615aDb309513c4CB564F44Bb68F' // created block 1322544

// dummy for testing
export function getEthPriceInUSD(): BigDecimal {
  // fetch price from market oracle
  let oracle = Oracle.load(XORACLE_ADDRESS)

  if (oracle !== null) {
    let data: BigInt = oracle.getPriceUsd
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
