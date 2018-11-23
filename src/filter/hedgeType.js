import { make } from 'react-lens';

make('hedgeType', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '对冲';
      break;
    case '2':
      data = '兑换';
      break;
    default:
      data = '-';
      break;
  }
  return data;
});
