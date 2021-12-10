import { isProduction } from './index'



const devAndTestMysqlConfig = {
  host: '192.168.10.93',
  port: 3306,
  username: 'root',
  password: 'Admin@12345678',
  database: 'test',
}

const prodMysqlConfig = {
  host: '3dl.mysql.database.chinacloudapi.cn',
  port: 3306,
  username: 'dfocus3dl@3dl',
  password: 'Admin@123456*3DL',
  database: '3dl',
  ssl: true,
}

// export const mysqlConfig = isProduction ? prodMysqlConfig : devAndTestMysqlConfig

export const mysqlConfig =  prodMysqlConfig 



const PG_HOST = !isProduction ? '192.168.10.93' : '180.167.234.224'
const PG_PORT = !isProduction ? 5466 : 10118

export const pgConfig = {
  host: PG_HOST,
  port: PG_PORT,
  username: 'postgres',
  password: '9XhNKZzybfI4iK4e1BN0r6IM89Xi3zaV',
  database: 'postgres',
}
