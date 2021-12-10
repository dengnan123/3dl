import { ImageStorage, VideoStorage } from './components/index';

export const MENU_LIST = [
  {
    key: 'imageStorage',
    label: '图片存储',
    render: () => <ImageStorage />,
  },
  {
    key: 'videoStorage',
    label: '视频存储',
    render: () => <VideoStorage />,
  },
];
