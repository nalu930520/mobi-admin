import { make } from 'react-lens';

make('relationStatus', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '有效';
      break;
    case '0':
      data = '无效';
      break;
    default:
      data = '无效';
      break;
  }
  return data;
});
