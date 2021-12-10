import { useEffect, useState, useRef } from 'react';
import { getNowUseApihostValue } from '@/helpers/view';
import { useFetchRedushDatasourceListById } from '@/hooks/redash';

export const useGetDataId = ({ apiHostId, apiHostList, envList }) => {
  const [detail, setDetail] = useState();
  const dataRef = useRef();
  dataRef.current = {
    apiHostList,
    envList,
  };
  useEffect(() => {
    const detail = getNowUseApihostValue({
      apiHostId,
      ...dataRef.current,
    });
    setDetail(detail);
  }, [apiHostId, apiHostList.length, envList.length]);
  return [detail];
};

export const useDatabaseIdChange = ({ data_source_id, setFieldsValue }) => {
  const { doApi, data } = useFetchRedushDatasourceListById();
  const countRef = useRef(0);
  useEffect(() => {
    if (!data_source_id) {
      return;
    }
    doApi({
      id: data_source_id,
    });
    if (countRef.current > 0) {
      console.log('countRef.current', countRef.current);
      setFieldsValue({
        queryId: undefined,
      });
    }
    countRef.current = countRef.current + 1;
  }, [data_source_id, setFieldsValue, doApi]);
  return [data, { doApi }];
};

