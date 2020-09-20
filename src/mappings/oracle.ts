/* eslint-disable prefer-const */
import { Oracle } from '../types/schema'
import { EthereumBlock } from '@graphprotocol/graph-ts'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts/index'
import { exponentToBigDecimal } from './helpers'
import { ZERO_BD } from './helpers'

const ORACLE_ADDRESS = '0x96db5d68b8d40c4c3d1d5d3e366d40152c1e23a2' // created block 1321197


// dummy for testing
export function getEthPriceInUSD(): BigDecimal {
  // fetch price from market oracle
  let oracle = Oracle.load(ORACLE_ADDRESS)

  if (oracle !== null) {
    let data: BigInt[] = oracle.getData
    if (data !== null && data[0] !== null) {
      let usd = data[0].toBigDecimal()
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
