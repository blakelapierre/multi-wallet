import { h, render } from 'preact-cycle';

export default {
  data: {
    name: 'TurtleCoin',
    wallets: []
  },

  UI: ({data}) => <turtlecoin-ui>{data.name} - under construction</turtlecoin-ui>
};