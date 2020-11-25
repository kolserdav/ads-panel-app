import { loadStore } from '../store';

export function waitLoad() {
  setTimeout(() => {
    loadStore.dispatch({ type: 'SET_LOAD', value: false });
  }, 2000);
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function stringifyQuery(params: any): string {
  let query = '';
  Object.keys(params).map((key: string) => {
    if (query === '') query += '?';
    query += `${key}=${params[key]}&`;
    return 0;
  });
  return query.replace(/&$/, '');
}
