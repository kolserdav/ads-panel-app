/**
 * Вебворкер для Реакт от comlink-loader
 * для тяжелых вычислений, чтобы не грузить браузер еффективнее используя ресурсы системы
 * Всё что с циклами не в lib а сюда.
 */
import dayjs from 'dayjs';
import * as Types from '../react-app-env';

function getDate(date: Date, format: string = 'DD-MM-YYYY'): string {
  return dayjs(date).format(format);
}

/**
 * Расчет данных для графика.
 * @param data - данные с сервера
 */
export function computeGraphData(data: any[]): Types.AllStat[] {
  return data.map((item: any) => {
    return {
      clicks: item.clicks,
      date: getDate(item.dateMax),
      impressions: item.impressions,
      requests: item.requests,
    };
  });
}

/**
 * Расчет данных для таблицы.
 * @param data - данные с сервера
 */
export function computeTableData(data: any[], groupBy: Types.GroupBy): Types.TableStatisticRow[] {
  let first: string;
  let second: string = '-';
  let value: any;
  let userName = '';
  return data.map((item: any) => {
    userName = `${item.first_name} ${item.last_name}`;
    switch (groupBy) {
      case 'campaign':
        first = 'Campaign';
        value = item.title;
        second = userName;
        break;
      case 'date':
        first = 'Date';
        value = `${getDate(item.dateMin, 'DD-MM-YYYY hh:mm:ss')}/${getDate(
          item.dateMax,
          'DD-MM-YYYY hh:mm:ss'
        )}`;
        break;
      case 'user':
        first = 'User';
        value = userName;
        break;
      case 'subid':
        first = 'Subid';
        value = item.subid;
        break;
      case 'country':
        first = 'Country';
        value = item.country;
        break;
      default:
        break;
    }
    return {
      id: item.campaign,
      userId: item.user_id,
      first,
      value,
      clicks: item.clicks,
      impressions: item.impressions,
      requests: item.requests,
      ctr: item.ctr,
      winRatio: item.win_ratio,
      countEvents: item.count,
      second,
      cost: item.cost,
    };
  });
}

/**
 * Расчет данных для таблицы кампаний админа.
 * @param data - данные с сервера
 */
export function computeAdminCampaignsData(data: any[]): Types.TableCampaignsRow[] {
  return data.map((item: any) => {
    return {
      userId: item.user_id,
      id: item.id,
      title: item.title,
      status: item.status,
      offerArchive: item.offer_archive,
      owner: `${item.first_name} ${item.last_name}`,
      price: item.price,
      budget: item.budget,
      countries: item.countries ? JSON.parse(item.countries) : [],
      blackList: item.black_list ? JSON.parse(item.black_list) : [],
      whiteList: item.white_list ? JSON.parse(item.white_list) : [],
      ipPattern: item.ip_pattern ? JSON.parse(item.ip_pattern) : [],
      created: getDate(item.created, 'DD-MM-YYYY hh:mm'),
      updated: getDate(item.updated, 'DD-MM-YYYY hh:mm'),
      offer: item.offer,
    };
  });
}
