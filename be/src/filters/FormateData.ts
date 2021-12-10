
import { merge, mapKeys, isObject, isArray, cloneDeep } from 'lodash'
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
/**
 * 格式化参数
 */
@Injectable()
export class FilterNoValue implements PipeTransform {
  transform(data: any, metadata: ArgumentMetadata) {
    return dealwithInputOrderData(data)
  }
}
export const dealwithInputOrderData = (data) => {
  const newData = filterNoValue(data)
  return newData
}


const filterNoValue = (data) => {
  Object.keys(data).map(key => {
    const v = data[key]
    if (filterValues.includes(v)) {
      delete data[key]
    }
    if (isObject(v) && !isArray(v)) {
      filterNoValue(v)
    }
  })
  return data
}

const filterValues = ['', null, undefined]


