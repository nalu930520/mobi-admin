import fetch from 'dva/fetch';
import { notification, message } from 'antd';
import store from 'store';

const getApiUrl = () => {
  let apiUrl = '';
  const env = process.env.NODE_ENV;
  switch (env) {
    case 'dev':
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
      break;
  }
  return apiUrl;
};

const URL = getApiUrl();

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status === 401 || response.status === 403) {
    history.pushState('/401', null);
    return;
  }
  response.json()
    .then((data) => {
      message.error(data.error_message);
    });
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: response.statusText,
  });
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {
    // credentials: 'include',
    headers: {
      token: store.get('adminToken'),
      'app-version': 'web:1.0.0',
    },
  };

  const needAddContentType = (option) => {
    // get 请求不用加
    if (!option.method) return false;
    // body 是 FormData 类型不用加 application/json
    if (option.body instanceof FormData) return false;
    return true;
  };
  const newOptions = { ...defaultOptions, ...options };
  if (needAddContentType(newOptions)) {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',

      ...newOptions.headers,
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  return fetch(URL + url, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .catch((error) => {
      console.log(error);
      if (error.code) {
        notification.error({
          message: error.name,
          description: error.message,
        });
      }
      if ('stack' in error && 'message' in error) {
        notification.error({
          message: `请求错误: ${url}`,
          description: error.message,
        });
      }
      return error;
    });
}
