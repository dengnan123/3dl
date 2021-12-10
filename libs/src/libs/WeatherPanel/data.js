/**
 * date	预报日期	2013-12-30
 * sr	日出时间	07:36
 * ss	日落时间	16:58
 * mr	月升时间	04:47
 * ms	月落时间	14:59
 * tmp_max	最高温度	4
 * tmp_min	最低温度	-5
 * cond_code_d	白天天气状况代码	100
 * cond_code_n	夜间天气状况代码	100
 * cond_txt_d	白天天气状况描述	晴
 * cond_txt_n	晚间天气状况描述	晴
 * wind_deg	风向360角度	310
 * wind_dir	风向	西北风
 * wind_sc	风力	1-2
 * wind_spd	风速，公里/小时	14
 * hum	相对湿度	37
 * pcpn	降水量	0
 * pop	降水概率	0
 * pres	大气压强	1018
 * uv_index	紫外线强度指数	3
 * vis	能见度，单位：公里	10
 */

export default {
  daily_forecast: [
    {
      cond_code_d: '101',
      cond_code_n: '302',
      cond_txt_d: '多云',
      cond_txt_n: '雷阵雨',
      date: '2020-06-28',
      hum: '40',
      mr: '12:03',
      ms: '00:07',
      pcpn: '1.0',
      pop: '55',
      pres: '996',
      sr: '04:48',
      ss: '19:46',
      tmp_max: '31',
      tmp_min: '22',
      uv_index: '5',
      vis: '24',
      wind_deg: '179',
      wind_dir: '南风',
      wind_sc: '1-2',
      wind_spd: '2',
    },
    {
      cond_code_d: '302',
      cond_code_n: '302',
      cond_txt_d: '雷阵雨',
      cond_txt_n: '雷阵雨',
      date: '2020-06-29',
      hum: '60',
      mr: '13:14',
      ms: '00:36',
      pcpn: '0.0',
      pop: '16',
      pres: '996',
      sr: '04:49',
      ss: '19:46',
      tmp_max: '30',
      tmp_min: '22',
      uv_index: '1',
      vis: '24',
      wind_deg: '89',
      wind_dir: '东风',
      wind_sc: '1-2',
      wind_spd: '9',
    },
    {
      cond_code_d: '101',
      cond_code_n: '101',
      cond_txt_d: '多云',
      cond_txt_n: '多云',
      date: '2020-06-30',
      hum: '53',
      mr: '14:24',
      ms: '01:06',
      pcpn: '0.0',
      pop: '24',
      pres: '997',
      sr: '04:49',
      ss: '19:46',
      tmp_max: '31',
      tmp_min: '21',
      uv_index: '6',
      vis: '25',
      wind_deg: '183',
      wind_dir: '南风',
      wind_sc: '1-2',
      wind_spd: '8',
    },
  ],
};
