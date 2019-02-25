import { h, render } from 'preact-cycle';

import {onFirstRun} from './utils';

import BitcoinCash from './bitcoinCash';
import TurtleCoin from './turtleCoin';

export
  const // load from config or something? (server?) (localStorage?) maybe have fallbacks....will hardcode for now
    coins = [
      BitcoinCash,
      TurtleCoin
    ];





export
  const
    CoinsUI =
    onFirstRun(
      () => {
        console.log('should only run once!')
      },

      ({coins}) => (<coins-ui>{coins.map(({UI, data}) => <UI data={data} />)}</coins-ui>)
      // ({coins}) => (<coins-ui>{coins.map(({name, wallets, info}) => <coin>{name}</coin>)}</coins-ui>)
    );

