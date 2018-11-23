import moment from 'moment';
import store from 'store';
import bg from 'bignumber.js';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}

export function getApiUrl() {
  let apiUrl = '';
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'staging':
      apiUrl = '';
      break;
    case 'preProduction':
      apiUrl = '';
      break;
    case 'production':
      apiUrl = '';
      break;
    default:
      apiUrl = '';
      break;
  }
  return apiUrl;
}

export function getMobileCodeByCountryCode(countryCode) {
  return store.get('countrys')
    .find(country => country.iso2 === countryCode);
}

export function getcurrencyBycode(currencyCode) {
  if (!currencyCode) {
    return {};
  }
  if (!store.get('currencies').find(currency => currency.code === currencyCode)) {
    return {
      decimal_place: 8,
    };
  }
  return store.get('currencies').find(currency => currency.code === currencyCode);
}

export function codeTocurrencyCode(code) {
  if (!code) return '';
  if (code === 'bcc') {
    return 'BCH';
  }
  return code.toUpperCase();
}

export function numberFormat(amount, dec, deal, displaydec) {
  bg.config({ ERRORS: false });
  const num = deal ? new bg(amount).toFormat() : new bg(amount).dividedBy(10 ** dec).toFormat(displaydec || null);
  return num;
}
export function normalizeNmuber(value, prevValue) {
  if (!value) return value;
  if (/^[0-9]+\.?[0-9]{0,9}$/.test(value)) {
    return value;
  }
  return prevValue;
}
// 转入转出格式
export function IntoString(value) {
  if (!value) return value;
  switch (value) {
    case 1:
      return '转入';
    case 2:
      return '转出';
      // case 3:
      //   return '转入/转出'
    default:
      return '-';
  }
}

// url参数转换对象
export function getParams(url) {
  try {
      var index = url.indexOf('?');
      url = url.match(/\?([^#]+)/)[1];
      var obj = {}, arr = url.split('&');
      for (var i = 0; i < arr.length; i++) {
          var subArr = arr[i].split('=');
          obj[subArr[0]] = subArr[1];
      }
      return obj;

  } catch (err) {
      return null;
  }
}

// 转入转出
export function verification(type) {
  return type === 2 ? '证件验证' : '地址验证'
}
// 结果
export function result(type) {
  return type === 1 ? '已通过' : '已拒绝'
}
