import { make } from 'react-lens';

make('accountStatus', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '激活';
      break;
    case '0':
      data = '锁定';
      break;
    default:
      data = '锁定';
      break;
  }
  return data;
});
