import cookies from 'js-cookie';
import { setLocale, getLocale } from 'umi-plugin-react/locale';
import { STORAGE_TOKEN_KEY } from '../config';
import { getRouterParams } from './view';

const fifteenDay = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
const REMEMBERME_FIFTEEN_DAY = {
  expires: fifteenDay, // 2 hours
  path: '/',
};

export function clearAll() {
  Object.keys(cookies.get()).forEach(name => {
    cookies.remove(name, REMEMBERME_FIFTEEN_DAY);
  });
  sessionStorage.clear();
  Object.keys(localStorage).forEach(name => {
    if (!['theme_mode', 'umi_locale'].includes(name)) {
      localStorage.removeItem(name);
    }
  });
}

export function setToken(value) {
  const twoHours = new Date(new Date().getTime() + 24 * 7 * 60 * 60 * 1000);

  const SHORT_TERM_COOKIE_OPTS = {
    expires: twoHours, //  7 天
    path: '/',
  };

  const fifteenDay = new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000);
  const REMEMBERME_FIFTEEN_DAY = {
    expires: fifteenDay, // 15 days
    path: '/',
  };
  // 不记住密码是2小时
  if (getDoNotRememberme()) {
    /* 用js-cookie set cookie时，option参数中不要设置domain字段
     * 因为如果不设置domain，设置cookie时会用地址栏中的域名做为domain
     * 如果设置了domain，如example.com，设置cookie时会用“.example.com”作为domain，这条cookie将会被其子域名读取到，如my.example.com
     */
    return cookies.set(STORAGE_TOKEN_KEY, value, SHORT_TERM_COOKIE_OPTS);
  }
  // 记住密码的话是15天
  return cookies.set(STORAGE_TOKEN_KEY, value, REMEMBERME_FIFTEEN_DAY);
}

export function getToken() {
  return cookies.get(STORAGE_TOKEN_KEY);
}

export function setDoNotRememberme() {
  const fifteenDay = new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
  const REMEMBERME_FIFTEEN_DAY = {
    expires: fifteenDay, // 2 hours
    path: '/',
  };
  return cookies.set('donotrememberme', 'true', REMEMBERME_FIFTEEN_DAY);
}

export function getDoNotRememberme() {
  return cookies.get('donotrememberme');
}

export function removeDoNotRememberme() {
  return cookies.remove('donotrememberme');
}

// 主题模式枚举
export const THEME_MODE = {
  DEFAULT: 'default',
  DARK: 'dark',
};

// 设置语言模式
export function setLocaleMode(localeMode) {
  setLocale(localeMode, false);
}

export function getLocaleMode(localeMode) {
  return getLocale();
}

export function setLocalUser(data) {
  localStorage.setItem('dpLocalUser', JSON.stringify(data));
}

export function getLocalUser() {
  return JSON.parse(localStorage.getItem('dpLocalUser'));
}

export function getStorageByKey(key) {
  const { pageId } = getRouterParams();
  const finalKey = `${pageId ?? ''}_${key}`;
  return JSON.parse(localStorage.getItem(finalKey));
}

export function setStorageBykey(key, data) {
  const { pageId } = getRouterParams();
  const finalKey = `${pageId ?? ''}_${key}`;
  localStorage.setItem(finalKey, JSON.stringify(data));
}

export function getSessionStorageByKey(key) {
  const { pageId } = getRouterParams();
  const finalKey = `${pageId ?? ''}_${key}`;
  return JSON.parse(sessionStorage.getItem(finalKey));
}

export function setSessionStorageBykey(key, data) {
  const { pageId } = getRouterParams();
  const finalKey = `${pageId ?? ''}_${key}`;
  sessionStorage.setItem(finalKey, JSON.stringify(data));
}
