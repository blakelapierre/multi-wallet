import { h, render } from 'preact-cycle';

import {coins, CoinsUI} from './coins';

console.log(coins);

const UI = ({coins}) => (
  <ui>
    <CoinsUI coins={coins} />
  </ui>
);

render(
  UI, {coins}, document.body
);