import { h, render } from 'preact-cycle';

import {onFirstRun} from './utils';

const CLICK_IDENTIFIER = (_) => {
  // _.displayValue = <img src={_.logo} />
  return _;
};

export default
  (data, {mutation}) =>
    onFirstRun(
      () => {
        console.log('run', data)
        data.displayValue = <span>{data.name}</span>;
      },
      (data) => <identifier onClick={console.log('data', data), mutation(CLICK_IDENTIFIER)}>{data.displayValue}</identifier>
      )(data);