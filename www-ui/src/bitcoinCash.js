import { h, render } from 'preact-cycle';

import bch from 'bitcore-lib-cash';

import {onFirstRun} from './utils';

import Identifier from './identifier';

function watchUtxos (_, mutation, data) {
  _.data = data;
  _.utxos = [];
  _.mempoolUtxos = [];
  data.utxos = _.utxos;
  data.mempoolUtxos = _.mempoolUtxos;

  const wallet = data.data.wallets.find(wallet => wallet.pubKeyAddressString == pubAddress.toString());

  console.log({wallet});

  const {pubKeyAddressString} = wallet;

  fetch(`https://api.blockchair.com/bitcoin-cash/outputs?q=recipient(${pubKeyAddressString.split(':')[1]})`)
  .then(response => response.json())
  .then(utxos => {
    mutation(SET_UTXOS)(wallet, utxos.data);
  });

  fetch(`https://api.blockchair.com/bitcoin-cash/mempool/outputs?q=recipient(${pubKeyAddressString.split(':')[1]})`)
  .then(response => response.json())
  .then(utxos => {
    mutation(SET_MEMPOOL_UTXOS)(wallet, utxos.data);
  });
}

function SET_UTXOS (_, wallet, utxos) {
  console.log('set_utxos', _, wallet, utxos);
  wallet.utxos = utxos;

  _.utxos = utxos;

  return _;
}

function SET_MEMPOOL_UTXOS (_, wallet, utxos) {
  wallet.mempoolUtxos = utxos;

  _.mempoolUtxos = utxos;

  return _;
}

const INIT = (_, mutation, data) => (
  console.log('init', {_}),
  _.mutation = mutation,
  watchUtxos(_, mutation, data),
  _
);

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



const Balance = ({}, {utxos, mempoolUtxos}) => (
  <balance>
    <confirmed>Confirmed: {utxos.reduce((sum, {value}) => sum + value, 0)}</confirmed>
    <mempool>Mempool: {mempoolUtxos.reduce((sum, {value}) => sum + value, 0)}</mempool>
  </balance>
);

const Coins = ({}, {utxos, mempoolUtxos}) => (
  <coins>
    <confirmed>{utxos.map(tx => <Coin tx={tx} />)}</confirmed>
    <mempool>{mempoolUtxos.map(tx => <Coin tx={tx} />)}</mempool>
  </coins>
);


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
      pubKeyAddressString: pubAddress.toString(),
      utxos: []
    }],
  },

  UI: onFirstRun(
    (data, {mutation}) => {
      console.log('first run init')
       mutation(INIT)(mutation, data);
       console.log({data});
    },
    ({data}, {mutation}) => (
      <bitcoin-cash-ui>
        <public-address>{pubAddress.toString()}</public-address>
        <Balance />
        <button onClick={() => alert('not implemented!')}>send</button>
        <button onClick={() => prompt('how much? (in satoshis please)')}>receive</button>
        <button onClick={() => alert('not implemented!')}>mine</button>
        <Coins />
      </bitcoin-cash-ui>
    )
  )
};