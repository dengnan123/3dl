const baseFields = ['name', 'type'];

const getObjByFields = (fields = {}, keys = []) => {
  return Object.keys(fields).reduce((pre, next) => {
    if (keys.includes(next)) {
      return {
        ...pre,
        [next]: fields[next],
      };
    }
    return pre;
  }, {});
};

const getMysqlOps = fields => {
  const optionFields = [
    'db',
    'host',
    'passwd',
    'user',
    'port',
    'ssl_key',
    'ssl_cert',
    'ssl_cacert',
    'use_ssl',
  ];
  const options = getObjByFields(fields, optionFields);
  const other = getObjByFields(fields, baseFields);
  return {
    ...other,
    options,
  };
};

const dbHash = {
  mysql: getMysqlOps,
};

export const getDdOpts = fields => {
  if (!dbHash[fields.type]) {
    throw new Error('type is error');
  }
  return dbHash[fields.type](fields);
};

const transformMysqlDdOpts = fields => {
  const { options } = fields;
  return {
    ...options,
    ...fields,
  };
};
const transformDbHash = {
  mysql: transformMysqlDdOpts,
};
export const transformDdOpts = fields => {
  if (!dbHash[fields.type]) {
    throw new Error('type is error');
  }
  return transformDbHash[fields.type](fields);
};
