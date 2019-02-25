import { h, render } from 'preact-cycle';

import bch from 'bitcore-lib-cash';

import {onFirstRun} from './utils';

import Identifier from './identifier';


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
  alert('localStorage not supported!!!!!!!! private key may not be saved!!!!!!!!!!!!!!!!!!!! private key "WIF": ' + pk.toWIF());
}


const pubKey = pk.toPublicKey(),
      address = pk.toAddress(),
      pubAddress = pubKey.toAddress();

console.log({pk, address, pubKey, pubAddress});

console.log(address.hashBuffer.toString('UTF-8'), pubAddress.toString());

// https://blockchair.com/bitcoin-cash/address/
// https://blockdozer.com/address/


export default {
  data: {
    name: 'Bitcoin Cash',
    wallets: []
  },

  UI: ({data}) => onFirstRun(
    () => {

    },
    (
      <bitcoin-cash-ui>
        {pubAddress.toString()}
        <iframe src={`https://blockchair.com/bitcoin-cash/address/${pubAddress.toString()}`} />
        <button onClick={}>send</button>
        <button>receive</button>
        <button>mine</button>
      </bitcoin-cash-ui>
    )
  )
};