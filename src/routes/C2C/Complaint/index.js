import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import moment from 'moment';
import { Form, Dropdown, Card, Modal, Badge, Divider, Upload, Input, Button, Icon, Row, Col } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import UploadImg from '../../../components/UploadImg';
import Filter from '../../../filter';
import styles from './index.less';
import { numberFormat, getcurrencyBycode } from '../../../utils/utils';

const { Description } = DescriptionList;
const { TextArea } = Input;
const FormItem = Form.Item;

const action = (detail, _this) => {
  if (detail.status === 2 || detail.status === 3) return '';
  return (
    <div>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          if (detail.is_handling_by_customer_service) {
            // 显示判决书
            _this.setState({
              judgePaperVisible: true,
            });
          } else {
            // 显示确认受理弹窗
            const { dispatch } = _this.props
            const judgment = Modal.confirm({
              content: '确定受理此次申诉',
              okText: '受理',
              cancelText: '取消',
              onOk: () => {
                _this.showJudgment();
                judgment.destroy();
              },
            });
          }
        }}
      >
        {detail.is_handling_by_customer_service ? '判决' : '受理'}
      </Button>
    </div>
  );
};

const description = (detail) => {
  return (
    <div>
      <DescriptionList className={styles.headerList} size="small" col="3">
        <Description term="申诉时间">{moment(detail.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
        <Description term="订单参考号">{detail.ref_id}</Description>
        <Description term="订单数量">{numberFormat(detail.crypto_amount, getcurrencyBycode(detail.crypto_currency_code).decimal_place)}&nbsp;{detail.crypto_currency_code}</Description>
        <Description term="订单金额">{numberFormat(detail.fiat_amount, getcurrencyBycode(detail.fiat_currency_code).decimal_place)}&nbsp;{detail.fiat_currency_code}</Description>
        <Description term="申诉状态"><Badge status="error" /><Filter value={detail.status} keyname="complaintOrderStatus" /></Description>
      </DescriptionList>
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="申诉发起方"><Link to={`/c2c/customer/${detail.claimant_id}`}>(+{detail.claimant_mobile_code}) {detail.claimant_mobile} {detail.claimant_detail.email}</Link>（{detail.complaint_from}）</Description>
        <Description term="申诉对象"><Link to={`/c2c/customer/${detail.respondent_id}`}>(+{detail.respondent_mobile_code}) {detail.respondent_mobile} {detail.respondent_detail.email}</Link>（{detail.complaint_to}）</Description>
      </DescriptionList>
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="申诉理由"><Filter value={detail.complaint_type} keyname="complaintReason" />&nbsp; : {detail.complaint_type === 3 ? detail.claimant_detail.content : ''}</Description>
      </DescriptionList>
    </div>
  );
};

@connect(state => ({
  complaint: state.complaint,
}))
@Form.create()
export default class ComplaintDetail extends Component {
  state = {
    claimantFileList: [],
    respondentFileList: [],
    visible: false,
    confirmLoading: false,
    showJudgment: false,
    claimantWin: false,
    previewVisible: false,
    previewImage: '',
    judgePaperVisible: false,
  }

  getComplaintString = (compaintDetail, judgeResult) => {
    const conplaintFrom = compaintDetail.complaint_from;
    const claimantMobiId = compaintDetail.claimant_mobi_id;
    const respondentMobiId = compaintDetail.respondent_mobi_id;
    if ((conplaintFrom === '买家' && judgeResult) || (conplaintFrom === '卖家' && judgeResult)) {
      return `数字资产将放至${claimantMobiId}账户`;
    }
    if ((conplaintFrom === '卖家' && !judgeResult) || (conplaintFrom === '买家' && !judgeResult)) {
      return `数字资产将放至${respondentMobiId}账户`;
    }
  }

  showJudgment = () => {
    const { dispatch } = this.props;
    const { detail } = this.props.complaint;
    dispatch({ type: 'complaint/updateHandlingStatus', payload: { complaint_id: detail.id } })
      .then(() => {
        dispatch({ type: 'fetchDetail', payload: detail.id });
      });
  }

  showModal = (judge) => {
    const { detail } = this.props.complaint;
    this.setState({
      ModalText: `确定判决 ${detail.claimant_mobi_id}(${detail.complaint_from})，申诉${judge ? '成功' : '失败'}。 ${this.getComplaintString(detail, judge)}`,
      visible: true,
      claimantWin: judge,
    });
  }

  // handleOk = () => {
  //   this.setState({
  //     ModalText: 'The modal will be closed after two seconds',
  //     confirmLoading: true,
  //   });
  //   setTimeout(() => {
  //     this.setState({
  //       visible: false,
  //       confirmLoading: false,
  //     });
  //   }, 2000);
  // }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  handleJudge = (status) => {
    this.showModal(status);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch } = this.props;
    const { detail } = this.props.complaint;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({ type: 'complaint/updateComplaintOrder', payload: { id: detail.id, reason: values.reason, winner_id: this.state.claimantWin ? detail.claimant_id : detail.respondent_id } });
      }
    });
    this.setState({
      judgePaperVisible: false,
    });
    this.setState({
      confirmLoading: true,
    });
  }
  closePreview = () => {
    this.setState({
      previewVisible: false,
    })
  }
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  formatfileList = (arr) => {
    const fileList = [];
    arr.forEach((element, index) => {
      fileList.push({
        uid: index,
        name: index,
        status: 'done',
        url: element,
      });
    });
    return fileList;
  }
  uploadRequest = (files, detail, uploadType) => {
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('uploader_id', uploadType === 'claimant' ? detail.claimant_id : detail.respondent_id);
    formData.append('complaint_id', detail.id);
    formData.append('item_type', '1');
    formData.append('evidence', files.file);
    dispatch({ type: 'complaint/uploadImg', payload: formData });
  }
  render() {
    const { visible, confirmLoading, ModalText, claimantFileList, respondentFileList }
      = this.state;
    const { getFieldDecorator } = this.props.form;
    const { detail } = this.props.complaint;
    const { conversations } = detail;
    const { img_path_arr: claimantImg } = detail.claimant_detail;
    const { claimant_images, respondent_images } = detail.admin_upload_images;
    const { img_path_arr: respondentImg } = detail.respondent_detail;
    const getWinnerInfo = (complaintDetail) => {
      if (!detail) {
        return {};
      }
      if (detail.winner_id === detail.claimant_id) {
        return {
          ...detail.claimant_detail,
          mobiId: detail.claimant_mobi_id,
        };
      } else {
        return {
          ...detail.respondent_detail,
          mobiId: detail.respondent_mobi_id,
        };
      }
    };
    return (
      <PageHeaderLayout
        title={`订单号：${detail.order_id}`}
        content={description(detail)}
        action={action(detail, this)}
      >
        {detail.status === 2 ? (
          <Card title="申诉结果" style={{ marginBottom: 24 }}>
            <p>申诉成功方 email: {getWinnerInfo(detail).email}</p>
            <p>申诉成功方 mobi id： {getWinnerInfo(detail).mobiId}</p>
            <p>判决原因：{detail.judge_reason}</p>
          </Card>
        ) : ''}
        <Card title="对话内容" style={{ marginBottom: 24 }} bordered={false}>
          <Row>
            <Col md={12} xs={24}>
              <div className={styles.chatWraper}>
                {conversations.map(con => (
                  <div className={styles.conversionWraper}>
                    <p><span style={{ color: '#000' }}>{con.from_username}</span> &nbsp; {moment(con.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</p>
                    {!!con.text && <p className={styles.conText}>{con.text}</p>}
                    {!!con.img_url &&
                      <Upload
                        className={`uploadWraper ${styles.conImg}`}
                        listType="picture-card"
                        fileList={this.formatfileList([con.img_url])}
                        onPreview={this.handlePreview}
                      />
                    }
                  </div>
                ))}
              </div>
            </Col>
            <Col md={12} xs={24}>
              <Row>
                <h3>申诉方证据:{claimantImg.length === 0 ? "" : moment.unix(detail.claimant_detail.created_at).format('YYYY-MM-DD HH:mm:ss')}</h3>
                {claimantImg.length === 0 ? '没有图片' : (
                  <Upload
                    className="uploadWraper"
                    listType="picture-card"
                    fileList={this.formatfileList(claimantImg)}
                    onPreview={this.handlePreview}
                  />
                )}
              </Row>

              <Row>
                <h3>被申诉方证据:{respondentImg.length === 0 ? "" : moment.unix(detail.respondent_detail.created_at).format('YYYY-MM-DD HH:mm:ss')}</h3>
                {respondentImg.length === 0 ? '没有图片' : (
                  <Upload
                    className="uploadWraper"
                    listType="picture-card"
                    fileList={this.formatfileList(respondentImg)}
                    onPreview={this.handlePreview}
                  />
                )}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              <h3>申诉方证据:</h3>
              <UploadImg
                fileList={this.formatfileList(claimant_images)}
                requestUpload={(files) => {
                  this.uploadRequest(files, detail, 'claimant');
                }}
              />
              <h3>被申诉方证据:</h3>
              <UploadImg
                fileList={this.formatfileList(respondent_images)}
                requestUpload={(files) => {
                  this.uploadRequest(files, detail, 'respondent');
                }}
              />
            </Col>
          </Row>
          <Divider />
        </Card>
        <Modal
          title="判决书"
          visible={this.state.judgePaperVisible}
          footer={null}
          style={{ width: '550px' }}
          onCancel={() => {
            this.setState({
              judgePaperVisible: false,
            });
          }}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('reason', {
                rules: [{
                  required: true, message: 'Please Input',
                }],
              })(
                <TextArea rows={4} />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={() => { this.handleJudge(true); }}>申诉成功</Button>
              &nbsp;&nbsp;<Button type="danger" onClick={() => { this.handleJudge(false); }}>申诉失败</Button>
            </FormItem>
          </Form>
        </Modal>
        <Modal
          visible={visible && detail.status !== 2}
          onOk={this.handleSubmit}
          confirmLoading={confirmLoading && detail.status !== 2}
          onCancel={this.handleCancel}
        >
          <p>{ModalText}</p>
        </Modal>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.closePreview}>
          <img alt="img" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </PageHeaderLayout>
    );
  }
}
