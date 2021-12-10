import CusModal from '../../../components/CusModal';
import { useNoActionAutoClose } from '../../../hooks/meeting';

const OkModal = props => {
  const { onChange, isHidden, otherCompParams = {}, style = {}, data } = props;
  const { openAutoClose, autoCloseTime } = style;
  const { modalPromptMsg } = data;
  useNoActionAutoClose({
    isHidden,
    openAutoClose,
    autoCloseTime,
    onChange,
  });

  const onOk = () => {
    onChange &&
      onChange({
        ...otherCompParams,
        includeEvents: ['showComps', 'hiddenComps', 'fetchApi'],
      });
  };

  const onCancel = () => {
    onChange &&
      onChange({
        includeEvents: ['hiddenComps', 'clearApiData'],
      });
  };

  const getModalType = () => {
    if (props.modalType) {
      return props.modalType;
    }
    if (style.modalType) {
      return style.modalType;
    }
    return 'submit';
  };

  const cusModalProps = {
    ...props,
    onOk,
    onCancel,
    visible: true,
    modalProps: {
      ...otherCompParams,
      ...style,
      modalPromptMsg,
      modalType: getModalType(),
    },
  };

  if (isHidden) {
    return null;
  }

  return <CusModal {...cusModalProps}></CusModal>;
};

export default OkModal;
