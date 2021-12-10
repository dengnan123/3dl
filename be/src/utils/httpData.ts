export const dealwithHttpData = (httpData) => {
  const { data }: any = httpData;
  if (data) {
    // 一般公司内部的接口返回值都有data
    return data;
  }
  // 外部接口可能没有data，就整个返回
  return httpData
}

export const getHttpAction = ({ methodType }) => {
  if (methodType === 'linkDatabase') {
    return 'redashQuery'
  }
  if (methodType === 'POST' || methodType === 'PATCH') {
    return 'postOrPatch'
  }
  return 'get'
}


export const getQueryInitParameters = (queryInfo) => {
  const parameters = queryInfo?.options?.parameters || []
  if (!parameters.length) {
    return {}
  }
  return parameters.reduce((pre, next) => {
    const { name, value } = next
    return {
      ...pre,
      [name]: value
    }
  }, {})
}