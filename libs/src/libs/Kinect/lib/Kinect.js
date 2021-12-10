import { useEffect, useRef, useCallback } from 'react';
import { Vector3 } from 'three';

export function useKinect(props) {
  const { event_ValueChange, IP } = props || {};
  const kinectronServerIpAddress = IP || '127.0.0.1';

  const kinectRef = useRef(null);
  const receiveDataRef = useRef({});
  const jointIndexDataRef = useRef({});

  const getJoints = useCallback(jointNum => {
    let data = {
      isExist: [],
      cameraPos: [],
    };
    for (let index = 0; index < 6; index++) {
      data.isExist.push(false);
      data.cameraPos.push(new Vector3(0, 0, 999999999));
    }
    let jd = receiveDataRef.current['body'].bodies;
    if (jd) {
      for (let index = 0; index < 6; index++) {
        if (!(jd[index] && jd[index].tracked)) {
          continue;
        }
        let jsd = jd[index].joints[jointNum];
        if (jsd) {
          data.isExist[index] = true;
          data.cameraPos[index].set(jsd.cameraX, jsd.cameraY, jsd.cameraZ);
        }
      }
    }

    return data;
  }, []);

  const initJointIndexData = useCallback(() => {
    jointIndexDataRef.current['mid_Spine'] = getJoints(1);
    // console.log(jointIndexData['mid_Spine']);
    const cps = jointIndexDataRef.current['mid_Spine'].cameraPos;
    let minDis = 99999999;
    for (let index = 0; index < 6; index++) {
      minDis = Math.min(cps[index].z, minDis);
    }
    jointIndexDataRef.current['minDis'] = minDis;
    // console.log(minDis);
    // event_ValueChange && event_ValueChange(minDis);
    if (event_ValueChange && minDis !== 99999999) {
      event_ValueChange(minDis);
    }
  }, [event_ValueChange, getJoints]);

  const init = useCallback(() => {
    if (!kinectRef.current) return;
    receiveDataRef.current['body'] = { value: null };
    const onBodiesChange = data => {
      receiveDataRef.current['body'] = data;
      initJointIndexData();
    };
    //receiveData['body'] = data;initJointIndexData();
    initJointIndexData();
    kinectRef.current.setColorCallback(data => {});
    kinectRef.current.setDepthCallback(data => {});
    kinectRef.current.setBodiesCallback(onBodiesChange);
    kinectRef.current.startBodies(onBodiesChange);
  }, [initJointIndexData]);

  useEffect(() => {
    // this.kinectron = new window.Kinectron(kinectronServerIpAddress);
    if (!window.Kinectron) {
      kinectRef.current = null;
      return;
    }

    const kinectron = new window.Kinectron(kinectronServerIpAddress);
    kinectron.setKinectType('windows');
    kinectron.makeConnection();
    kinectRef.current = kinectron;
  }, [kinectronServerIpAddress]);

  useEffect(() => {
    init();
  }, [init]);

  // let frameIndex = 0,
  //   receiveIndex = 0;
  // this.jointIndexData = {};
  // let jointIndexData = this.jointIndexData;

  // this.animate = function() {
  //   frameIndex++;
  //   if (frameIndex - receiveIndex > 100) {
  //     console.log('Kinectron服务器断开');
  //     console.log('尝试重连');
  //     kinectron.makeConnection();
  //   }
  // };
}
