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

import btc from 'bitcore-lib-cash';

import {onFirstRun} from './utils';

import Identifier from './identifier';


const bch = btc;
// return (<GenericBitcoin btc={bch} />);

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
  _.transactionList = [],
  watchUtxos(_, mutation, data),
  _
);

const CLICK_ADDRESS = _ => _;

const SEND_UTXO_CLICKED = (_, tx) => (
  _.transactionList.push(tx),
  tx.__sendValue = tx.value,
  tx.__isSending = true,
  _
);

const SET_TX_SEND_SIZE = (_, tx, value) => (
  // (_.transactionList = _.transactionList || []).push(tx);
  value === '0' ? (tx.__isSending = false /*should remove from tx list*/)
                : tx.__sendValue = value,
  console.log(tx),
  _
);

const SET_TX_TO_ADDRESS = (_, tx, address) => (
  tx.__toAddress = address,
  btc.Address.isValid(address) ? tx.__toAddressImg = makeAddressImageUrl(address) : undefined,
  _
);

const SET_TX_FEE = (_, fee) => (
  _.sendFee = fee,
  _
);

const canvas = document.createElement('canvas'),
      context = canvas.getContext('2d'),
      pixel = new ImageData(1, 1);

canvas.width = 8;
canvas.height = 7;



//https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
var seed = 1;
function random(c) {
    var x = Math.sin(c++) * 10000;
    return x - Math.floor(x);
}

function makeAddressImageUrl(address) {
  if (address.indexOf('bitcoincash:') !== 0) address = 'bitcoincash:' + address;

// bitcoincash:qz5mpxwjl9q44x5uldw0rhfyvcymmq2egy4c8w8528

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 8; j++) {
      if (1 + i * 8 + j > 53) continue;

      const code = address.charCodeAt(i * 8 + j),
            flip = (code >>> 4 | code << 4) >>> 4 | (code >>> 4 | code << 4) << 4;

      console.log('code', code);

      pixel.data[0] = Math.floor(random(flip) * 255);
      pixel.data[1] = Math.floor(random(flip+1) * 255);
      pixel.data[2] = Math.floor(random(flip+2) * 255);
      pixel.data[3] = 255;

      console.log(pixel.data);

      context.putImageData(pixel, j, i);
    }
  }

  context.imageSmoothingEnabled = false;

  return canvas.toDataURL();
}

const SEND_SATOSHIS = (_, satoshis, address) => {
  alert('not implemented');
  return _;
};

const RECEIVE_SATOSHIS = (_, satoshis) => {
  alert('not imple');
  return _;
};


console.log({btc});

let pk = new btc.PrivateKey();

try {
  const savedKey = localStorage.getItem('bch-private-key');

  if (savedKey) {
    pk = new btc.PrivateKey(savedKey);
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

// render . for > 1 coin ?
const Satoshis = ({children}) => (
  <satoshis>{split(children[0], 3).join(' ')}</satoshis>
);

function split(s, every) {
  const r = new Array(Math.ceil(s.length / every));

  // '0.01234567' -> '1234567' -> '1 234 567'
  //                  0123456      012345678

  // '0.00000012' -> '12' => '12'

  for (let i = 0; i < r.length; i++) {
    // s.length = 7
    // r.length = 3
    // every = 3
    // i = 0   s.substr(0, 1);  ( , )
    // i = 1   s.substr(1, 3);  ( , every)
    // i = 2   s.substr(4, 3);  ( , every)

    const start = i === 0 ? 0 : s.length - every * (r.length - i),
          length = i === 0 ? (s.length % every === 0 ? every : s.length % every) : every;

    r[i] = s.substr(start, length);
console.log(s, every, start, length, r)
    // r[i] = s.substr(
    //         (r.length - i) * every > s.length - 1 ?
    //                                               0 :
    //                                               s.length -  i * every,

    //         (r.length - i) * every > s.length - 1 ?
    //                                               ((r.length - i) * every - s.length - 1) :
    //                                               every);

    console.log(r, i, every, i * every, s.length, i * every > s.length - 1 ? 0 : s.length - 1 -  i * every, (r.length - i) * every);
  }

  return r.length === 0 ? ['0'] : r;
}

const Balance = ({}, {utxos, mempoolUtxos}) => (
  <balance>
    <confirmed>Confirmed: <Satoshis>{utxos.reduce((sum, {value}) => sum + value, 0)}</Satoshis></confirmed>
    <mempool>Mempool: <Satoshis>{mempoolUtxos.reduce((sum, {value}) => sum + value, 0)}</Satoshis></mempool>
  </balance>
);

const Coins = ({}, {utxos, mempoolUtxos}) => (
  <coins>
    {utxos.map(tx => <Coin className="confirmed" tx={tx} />)}
    {mempoolUtxos.map(tx => <Coin className="mempool" tx={tx} />)}
  </coins>
);

// const Coins = ({}, {utxos, mempoolUtxos}) => (
//   <coins>
//     <confirmed>{utxos.map(tx => <Coin tx={tx} />)}</confirmed>
//     <mempool>{mempoolUtxos.map(tx => <Coin tx={tx} />)}</mempool>
//   </coins>
// );


const Coin = ({tx}, {mutation}) => (
  <coin class={tx.block_id === -1 ? 'mempool' : 'confirmed'}>
    <a target="__blank" href={`https://blockchair.com/bitcoin-cash/transaction/${tx.transaction_hash}`}>
      <Satoshis>{tx.value}</Satoshis>
    </a>
    {tx.__isSending ? <input type="number"
                             size="8"
                             onChange={event => mutation(SET_TX_SEND_SIZE)(tx, parseInt(event.target.value, 10))}
                             min={0}
                             max={tx.value}
                             value={parseInt(tx.__sendValue > 0 ? tx.__sendValue : tx.value, 10)} /> : undefined}
    {tx.__isSending ? (tx.__toAddressImg ? <img src={tx.__toAddressImg} />
                                         : <input type="text"
                                                 onChange={event => mutation(SET_TX_TO_ADDRESS)(tx, event.target.value)}
                                                 placeholder="to address"
                                                 value={tx.__toAddress || ''} />
                      )
                    : undefined}
    {!tx.__isSending ? <button onClick={() => mutation(SEND_UTXO_CLICKED)(tx)}>send</button> : undefined}
  </coin>
);
    // <input type="checkbox" onChange={mutation(COIN_CHECKBOX_CHANGE, tx)} />

const TransactionList = ({list}, {mutation}) => (
  <transaction-list>
    {list.map(tx => <Transaction tx={tx} />)}
  </transaction-list>
);

const Transaction = ({}, {mutation, sendFee, transactionList}) => {
  const sendValue = transactionList.reduce((sum, tx) => sum + tx.__sendValue, 0),
        utxoValue = transactionList.reduce((sum, tx) => sum + tx.value, 0),
        fee = utxoValue - sendValue;
        console.dir({sendValue, utxoValue, fee});
  if (fee > 2000) alert('fee greater than 2000 satoshi! are you sure??');

  return (
    <transaction>
      <Satoshis>{sendValue}</Satoshis>

      fee: <input type="number" min="0" max={fee} value={sendFee !== undefined ? sendFee : fee} onChange={event => mutation(SET_TX_FEE)(parseInt(event.target.value, 10))} />

      change: <Satoshis>{utxoValue - sendValue - (sendFee !== undefined ? sendFee : fee)}</Satoshis>
    </transaction>
  );
};

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
    ({data}, {mutation, transactionList}) => (
      <bitcoin-cash-ui>
        <wallet-info>
          <public-address onClick={mutation(CLICK_ADDRESS)}>{pubAddress.toString()}</public-address>
          <a target="__blank" href={`https://blockchair.com/bitcoin-cash/address/${pubAddress.toString()}`}><Balance /></a>
          <Coins />
          {transactionList.length > 0 ? <Transaction /> : undefined}
          <button onClick={() => mutation(RECEIVE_SATOSHIS)(prompt('how much? (in satoshis please)'))}>receive</button>
          <button onClick={() => alert('not implemented!')}>mine</button>
        </wallet-info>
      </bitcoin-cash-ui>
    )
  )
};
        // <TransactionList list={transactionList} />
          // <button onClick={() => mutation(SEND_SATOSHIS)(prompt('how much? (in satoshis please)', prompt('to where')))}>send</button>