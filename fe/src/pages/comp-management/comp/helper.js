const ALL_MENU = { id: 'ALL', name: '全部' };

function queryListData(res) {
  if (!res) {
    return {};
  }
  const { errorCode, data } = res || {};
  if (errorCode !== 200) {
    return {};
  }

  return data;
}

export { ALL_MENU, queryListData };
