import API from '../../helpers/api';
import yayJpg from '../../assets/yay.jpg';

// 获取图片列表
export function getImageList() {
  // const res = API.get(`/replace`);
  let imageList = [];
  const length = parseInt(Math.random() * 40);
  for (let i = 1; i < length; i++) {
    const obj = {
      id: i,
      name: `图片${i}`,
      size: `${(Math.random() * 200).toFixed(2)}kb`,
      uploadTime: new Date().getTime(),
      src:
        i % 2 === 0
          ? yayJpg
          : 'https://qa.booking.dfocus.tech/files/dmeeting/2020/system/202010/282C4831FD046994DBE0654AD03932A7.jpeg',
    };
    imageList.push(obj);
  }
  return new Promise(resolve => {
    setTimeout(() => {
      // resolve(res);
      resolve({ errorCode: 200, data: imageList });
    }, 300);
  });
}

// 获取视屏列表
export function getVideoList() {
  // const res = API.get(`/replace`);
  let videoList = [];
  const length = parseInt(Math.random() * 40);
  for (let i = 1; i < length; i++) {
    const obj = {
      id: i,
      name: `视频${i}`,
      size: `${(Math.random() * 200).toFixed(2)}kb`,
      uploadTime: new Date().getTime(),
      src: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      poster:
        i % 2 === 0
          ? yayJpg
          : 'https://qa.booking.dfocus.tech/files/dmeeting/2020/system/202009/FBD25B089AF3B1F6C8F9E7E26B1E8C21.jpg',
    };
    videoList.push(obj);
  }
  return new Promise(resolve => {
    setTimeout(() => {
      // resolve(res);
      resolve({ errorCode: 200, data: videoList });
    }, 300);
  });
}
