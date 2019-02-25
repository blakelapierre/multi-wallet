import { h, render } from 'preact-cycle';

import bch from 'bitcore-lib-cash';

import {onFirstRun} from './utils';

import Identifier from './identifier';

try {
  const savedKey = localStorage.getItem('bch-private-key');

  if (savedKey) {

  }
}
catch (e) {
  alert('localStorage not supported!!!!!!!! private key may not be saved!!!!!!!!!!!!!!!!!!!!')
}

console.log({bch});

const pk = new bch.PrivateKey(),
      pubKey = pk.toPublicKey(),
      address = pk.toAddress(),
      pubAddress = pubKey.toAddress();

console.log({pk, address, pubKey, pubAddress});

console.log(address.hashBuffer.toString('UTF-8'), pubAddress.toString());

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
        <iframe src={`https://blockdozer.com/address/${pubAddress.toString()}`} />
        <button>send</button>
        <button>receive</button>
        <button>mine</button>
      </bitcoin-cash-ui>
    )
  )
};