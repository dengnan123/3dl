
export const postQuery = '/api/query_results'

export const getJob = 'api/jobs'


export const getQuery = '/api/query_results'



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