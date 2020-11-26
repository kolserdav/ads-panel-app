/**
 * Вебворкер для Реакт comlink-loader
 * для тяжелых вычислений, чтобы не грузить браузер еффективнее используя ресурсы системы
 * Всё что с циклами не в lib а сюда.
 */
import dayjs from 'dayjs';
import * as Types from '../react-app-env';

/**
 * Расчет данных для графика.
 * @param data - данные с сервера
 */

export function computeGraphData(data: any[]): Types.GraphData[] {
  return data.map((item: any) => {
    return {
      clicks: item.clicks,
      date: dayjs(item.dateMax).format('YYYY MM D'),
      cost: item.cost
    };
  });
}