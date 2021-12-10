export const staticFilePath = '';

export const isProduction = process.env.NODE_ENV === 'production'
export const REDASH_API_AUTH = 'wUdidFAXmKcsxFkGOzYINVmApRcfTahpETp02ap4'


export const getREDASH_API_HOST = () => {
  if (!isProduction) {
    return 'http://192.168.10.93:1080'
  }
  return process.env.REDASH_API_HOST || 'https://dm3dl.dfocus.top/query'
}

export const REDASH_API_HOST = getREDASH_API_HOST()

console.log('REDASH_API_HOST>>>>>>>>>>------', REDASH_API_HOST)


export const PORT = process.env.PORT || 3000

export const LOCAL_API_HOST = `http://localhost:${PORT}`


export const STATIC_PATH = process.env.STATIC_PATH

export const JWT_SECRET = '3dl'

export const onlyReadUserId = 'f07ff16e-93aa-4d8d-900a-2e73c2aaca37'