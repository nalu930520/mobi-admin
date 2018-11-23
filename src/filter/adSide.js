import { make } from 'react-lens';

make('adSide', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '买';
      break;
    case '2':
      data = '卖';
      break;
    default:
      data = '-';
      break;
  }
  return data;
});