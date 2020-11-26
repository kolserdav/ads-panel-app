/**
 * библиотечные функции
 */
// @ts-ignore
import { loadStore } from '../store';
/**
 * Отключение загрузки после ожидания
 */
export function waitLoad() {
  setTimeout(() => {
    loadStore.dispatch({ type: 'SET_LOAD', value: false });
  }, 2000);
}

/**
 * Переводит первый символ строки в верхний регистр
 * @param string
 */
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Переводит объект в query string строку
 * @param params
 */
export function stringifyQuery(params: any): string {
  let query = '';
  Object.keys(params).map((key: string) => {
    if (query === '') query += '?';
    query += `${key}=${params[key]}&`;
    return 0;
  });
  return query.replace(/&$/, '');
}
