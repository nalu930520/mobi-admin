import React, { Component } from 'react';
import { Upload, Icon, Modal } from 'antd';
import { connect } from 'dva';
import s from './index.less';

@connect(state => ({
  complaint: state.complaint,
}))
export default class UploadImg extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => {
    console.log('files12:', fileList);
    this.props.handleChange(fileList);
  }

  handleUpload = (files) => {
    console.log('files:', files);
    const { dispatch } = this.props;
    let formData = new FormData();
    formData.append('uploader_id', '24');
    formData.append('complaint_id', '11');
    formData.append('item_type', '1');
    formData.append('evidence', files);
    console.log('FormData:', formData.values());
    dispatch({ type: 'complaint/uploadImg',
      payload: formData,
    });
  }

  handleCancel = () => {
    this.setState({
      previewVisible: false,
    });
  }
  render() {
    const { previewVisible, previewImage } = this.state;
    const { fileList, requestUpload } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className={s.uploadimgWraper}>
        <Upload
          fileList={fileList}
          listType="picture-card"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          customRequest={(files) => {
            requestUpload(files);
          }}
        >
          {uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
