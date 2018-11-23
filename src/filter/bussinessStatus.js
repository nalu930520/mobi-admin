import { make } from 'react-lens';

make('bussinessStatus', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '已上架';
      break;
    case '0':
      data = '已下架';
      break;
    default:
      data = '已下架';
      break;
  }
  return data;
});
