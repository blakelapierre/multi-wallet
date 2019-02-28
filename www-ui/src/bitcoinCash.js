// TODO:
/******

  backup private key...WIF format, I think
   -allow encrypted export?

  send transactions

  links

  mining

  better ui styling

  auto refresh balance and infos (can get events pushed?)

  turtlecoin (collapse with other coin uis ?  with custom parts?)

  bitcoin (collapse w/ cash ui (only diff seems to be import lib))

*/

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

const SEND_UTXO_CLICKED = _ => (alert('not implemented'), _);

const COIN_CHECKBOX_CHANGE = (_, tx) => {
  alert('not implemented');
  return _;
};

const SEND_SATOSHIS = (_, satoshis, address) => {
  alert('not implemented');
  return _;
};

const RECEIVE_SATOSHIS = (_, satoshis) => {
  alert('not imple');
  return _;
};


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

const Satoshis = ({children}) => (
  <satoshis>{JSON.stringify(children)}</satoshis>
);

const Balance = ({}, {utxos, mempoolUtxos}) => (
  <balance>
    <confirmed>Confirmed: <satoshis>{utxos.reduce((sum, {value}) => sum + value, 0)}</satoshis></confirmed>
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
    <a target="__blank" href={`https://blockchair.com/bitcoin-cash/transaction/${tx.transaction_hash}`}>{tx.value}</a>
    <button onClick={mutation(SEND_UTXO_CLICKED)}>send</button>
    <input type="checkbox" onChange={mutation(COIN_CHECKBOX_CHANGE, tx)} />
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
        <a target="__blank" href={`https://blockchair.com/bitcoin-cash/address/${pubAddress.toString()}`}><Balance /></a>
        <button onClick={() => mutation(SEND_SATOSHIS)(prompt('how much? (in satoshis please)', prompt('to where')))}>send</button>
        <button onClick={() => mutation(RECEIVE_SATOSHIS)(prompt('how much? (in satoshis please)'))}>receive</button>
        <button onClick={() => alert('not implemented!')}>mine</button>
        <Coins />
      </bitcoin-cash-ui>
    )
  )
};