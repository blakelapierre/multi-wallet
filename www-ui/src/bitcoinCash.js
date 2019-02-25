import { h, render } from 'preact-cycle';

import bch from 'bitcore-lib-cash';

import {onFirstRun} from './utils';

import Identifier from './identifier';


const INIT = (_, mutation) => (console.log('init'), _.mutation = mutation, _.utxos = [], _);

const SEND_UTXO_CLICKED = _ => _;


console.log({bch});

let pk = new bch.PrivateKey();

try {
  const savedKey = localStorage.getItem('bch-private-key');

  if (savedKey) {
    pk = new bch.PrivateKey(savedKey);
  }
  else localStorage.setItem('bch-private-key', pk.toWIF());
}
catch (e) {
  // https://bitcore.io/api/lib/private-key  https://imgur.com/a/QwzJqsx
  alert('localStorage not supported!!!!!!!! private key may not be saved!!!!!!!!!!!!!!!!!!!! private key "WIF": ' + pk.toWIF());
}


const pubKey = pk.toPublicKey(),
      address = pk.toAddress(),
      pubAddress = pubKey.toAddress();

console.log({pk, address, pubKey, pubAddress});

console.log(address.hashBuffer.toString('UTF-8'), pubAddress.toString());

// explorers:
// https://blockchair.com/bitcoin-cash/address/
// https://blockdozer.com/address/

fetch(`https://api.blockchair.com/bitcoin-cash/outputs?q=recipient(${pubAddress.toString().split(':')[1]})`)
  .then(response => response.json())
  .then(utxos => {
    console.log({utxos})
  });

const Balance = ({}, {utxos}) => <balance>{utxos.reduce((sum, {value}) => sum + value, 0)}</balance>;

const Coins = ({}, {utxos}) => <coins>{utxos.map(tx => <Coin tx={tx} />)}</coins>;

const Coin = ({tx}, {mutation}) => (
  <coin>
    {tx.value}
    <button onClick={mutation(SEND_UTXO_CLICKED)}>send</button>
    <input type="checkbox" />
  </coin>
);

export default {
  data: {
    name: 'Bitcoin Cash',
    wallets: [{
      pubKeyAddressString: pubAddress.toString()
    }]
  },

  UI: onFirstRun(
    ({data}, {mutation}) => {
      console.log('first run init')
       mutation(INIT)(mutation);
    },
    ({data}, {mutation}) => (
      <bitcoin-cash-ui>
        {pubAddress.toString()}
        <Balance />
        <button onClick={() => alert('not implemented!')}>send</button>
        <button onClick={() => prompt('how much? (in satoshis please)')}>receive</button>
        <button onClick={() => alert('not implemented!')}>mine</button>
        <Coins />
      </bitcoin-cash-ui>
    )
  )
};