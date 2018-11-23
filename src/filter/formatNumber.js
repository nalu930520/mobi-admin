import { make } from 'react-lens';
import bg from 'bignumber.js';

make('formatNumber', 'string', (content) => {
  if (content === '-') {
    return '-';
  } else {
    return bg(content).toFormat();
  }
});
