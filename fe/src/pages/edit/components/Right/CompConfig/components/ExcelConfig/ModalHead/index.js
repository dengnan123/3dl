import { useMemo } from 'react';
import PropTypes from 'prop-types';
import XLSX from 'xlsx';
import { Button, Upload } from 'antd';

import styles from './index.less';

function ModalHead(props) {
  const {
    handleDealExcelData,
    handleAdd,
    handleExportExcel,
    handleDownloadExcel,
    hiddenAddBtn,
  } = props;

  const uploadProps = useMemo(() => {
    return {
      name: 'file',
      headers: {},
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      showUploadList: false,
      beforeUpload(file) {
        let rABS = true;
        let reader = new FileReader();
        reader.onload = function(e) {
          let data = e.target.result;
          if (!rABS) data = new Uint8Array(data);
          const workbook = XLSX.read(data, {
            type: rABS ? 'binary' : 'array',
          });
          // 假设我们的数据在第一个标签
          const first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
          // XLSX自带了一个工具把导入的数据转成json
          const jsonArr = XLSX.utils.sheet_to_json(first_worksheet, { header: 1 });
          // 通过自定义的方法处理Json，比如加入state来展示
          handleDealExcelData(jsonArr);
        };
        if (rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
        return false;
      },
    };
  }, [handleDealExcelData]);

  return (
    <header className={styles.header}>
      {!hiddenAddBtn && (
        <Button type="primary" onClick={handleAdd}>
          添加行
        </Button>
      )}
      <Upload {...uploadProps}>
        <Button>导入Excel</Button>
      </Upload>
      <Button onClick={handleExportExcel}>导出Excel</Button>
      <Button type="link" onClick={handleDownloadExcel}>
        下载Excel模板
      </Button>
    </header>
  );
}

ModalHead.propTypes = {
  handleDealExcelData: PropTypes.func,
  handleAdd: PropTypes.func,
  handleDownloadExcel: PropTypes.func,
  handleExportExcel: PropTypes.func,
};

export default ModalHead;
