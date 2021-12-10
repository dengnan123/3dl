import emitter from '@/helpers/mitt';
import { useState, useRef } from 'react';
import { omit } from 'lodash';
import { useCustomCompareEffect } from 'react-use';
import isEqual from 'fast-deep-equal';
import { getBasicStyle } from '@/helpers/utils';
import { v4 as uuid } from 'uuid';

const Wrap = Comp => {
  return function useName(props) {
    const initHiddenArr = props.data.filter(v => v.isHidden).map(v => v.id);
    const [newHiddenObj, setHidden] = useState({});
    const dataRef = useRef({});
    const dataObj = dataRef.current;
    const [changeId, setChange] = useState();
    useCustomCompareEffect(
      () => {
        for (const id of initHiddenArr) {
          emitter.on(`${id}_show`, () => {
            setHidden(preData => {
              return {
                ...preData,
                [id]: 0,
              };
            });
          });
          emitter.on(`${id}_hidden`, () => {
            setHidden(preData => {
              return {
                ...preData,
                [id]: 1,
              };
            });
          });
        }
        return () => {
          for (const id of initHiddenArr) {
            emitter.off(`${id}_show`);
            emitter.off(`${id}_hidden`);
          }
        };
      },
      [initHiddenArr],
      (prevDeps, nextDeps) => {
        const preProps = prevDeps[0];
        const nextProps = nextDeps[0];
        return isEqual(preProps, nextProps);
      },
    );

    const gridCardArr = props.data.map(v => {
      return omit(v, ['child']);
    });

    useCustomCompareEffect(
      () => {
        const emitterObj = {};
        for (const v of gridCardArr) {
          const { dataSourceId, id } = v;
          if (dataSourceId?.length) {
            for (const apiId of dataSourceId) {
              emitter.on(`${apiId}_data`, fetchData => {
                emitterObj[`${apiId}_data`] = 1;
                const { gridHeight } =
                  getBasicStyle({
                    ...v,
                    data: fetchData,
                  }) || {};
                dataRef.current[id] = gridHeight;
                setChange(uuid());
              });
            }
          }

          const key = `${id}_changeGridHeight`;
          emitter.on(key, nd => {
            emitterObj[key] = 1;
            const { gridHeight } =
              getBasicStyle({
                ...v,
                data: nd,
              }) || {};
            dataRef.current[id] = gridHeight;
            setChange(uuid());
          });
        }
        return () => {
          const keys = Object.keys(emitterObj);
          if (keys?.length) {
            for (const key of keys) {
              emitter.off(key);
            }
          }
        };
      },
      [gridCardArr],
      (prevDeps, nextDeps) => {
        const preProps = prevDeps[0];
        const nextProps = nextDeps[0];
        return isEqual(preProps, nextProps);
      },
    );

    const newProps = {
      ...props,
      data: props.data.map(v => {
        let newV = {
          ...v,
        };
        const { id } = newV;
        if (newHiddenObj[id] !== undefined) {
          newV.isHidden = newHiddenObj[id];
        }
        if (dataObj[id] !== undefined) {
          newV.gridHeight = dataObj[id];
        }
        return newV;
      }),
    };

    return <Comp {...newProps} changeId={changeId}></Comp>;
  };
};

export default Wrap;
