/* eslint-disable prefer-const */
import { PriceStore } from '../types/schema'
import { Oracle } from '../types/Oracle/Oracle'
import { Address, EthereumBlock, json, JSONValueKind } from '@graphprotocol/graph-ts'
import { BigDecimal, BigInt } from '@graphprotocol/graph-ts/index'
import { exponentToBigDecimal } from './helpers'
import { ZERO_BD } from './helpers'

const XORACLE_ADDRESS = '0xaefF2F7644f1C615aDb309513c4CB564F44Bb68F' // created block 1322544

// dummy for testing
export function getEthPriceInUSD(): BigDecimal {
  // fetch price from market oracle
  let oracle = PriceStore.load(XORACLE_ADDRESS)
  if (oracle == null) {
    return BigDecimal.fromString('0.2') // ZERO_BD
  } else {
    return oracle.usd
  }
}

export function priceUpdate(block: EthereumBlock): void {
  let oracle = PriceStore.load(XORACLE_ADDRESS)
  if (oracle == null) {
    oracle = new PriceStore(XORACLE_ADDRESS)
    oracle.usd =  BigDecimal.fromString('0.2') // ZERO_BD
  } else {
    let contract = Oracle.bind(Address.fromString(XORACLE_ADDRESS))
    if (contract == null) {
      oracle.usd =  BigDecimal.fromString('0.2') // ZERO_BD
    } else {
      let data: BigInt = contract.getPriceUsd()
      if (data == null) {
        oracle.usd =  BigDecimal.fromString('0.2') // ZERO_BD
      } else {
        oracle.usd = data.toBigDecimal().div(exponentToBigDecimal(BigInt.fromI32(6)))
      }
    }
  }
  oracle.save()
}
