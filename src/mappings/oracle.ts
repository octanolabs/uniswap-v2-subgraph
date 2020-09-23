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
    return oracle.usd
  } else {
    return BigDecimal.fromString('0.2') // ZERO_BD
  }
}

export function handlePriceUpdate(event: PriceUpdated): void {
  let oracle = Oracle.load(XORACLE_ADDRESS)
  if (oracle == null) {
    oracle = new Oracle(XORACLE_ADDRESS)
  }
  let data: BigInt = event.params.usd
  oracle.usd = data.toBigDecimal().div(exponentToBigDecimal(BigInt.fromI32(6)))
  oracle.save()
}
