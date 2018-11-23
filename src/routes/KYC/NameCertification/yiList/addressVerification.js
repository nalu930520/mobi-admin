import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Input, Card, Modal } from 'antd';
const { Meta } = Card;
const { TextArea } = Input;
import moment from 'moment'
const FormItem = Form.Item;
import DescriptionList from '../../../../components/DescriptionList';
import PageHeaderLayout from '../../../../layouts/PageHeaderLayout';
import styles from './DocumentVerification.less';
import { getParams } from '../../../../utils/utils';
const { Description } = DescriptionList;

const description = (obj, met) => {
  return (
    <DescriptionList className={styles.headerList} size="small" col="4">
    <Description term="创建时间"> {moment(obj.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
    <Description term="手机号码"> {obj.mobile}</Description>
    <Description term="手机号所属国家">{obj.mobile_country}</Description>
    <Description term="验证类型">{obj.level}</Description>
    <Description term="完成时间"> {moment(obj.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Description>
    <Description term="审核结果"> {obj.status}
      {obj.status === 1 &&
        <a href="javascript:;" onClick={() => { met.showModal('visible') }}>查看拒绝理由</a>
      }
    </Description>
    <Description term="审核人"> {obj.auditor}</Description>
    <Description term="备注">{obj.memo}
      {!obj.memo &&
        <a href="javascript:;" onClick={() => { met.showModal('visible1') }}>添加备注</a>
      }
    </Description>
  </DescriptionList>
  )
}

@connect(state => ({
  NameCertification: state.NameCertification,
}))
@Form.create()
export default class addressVerification extends PureComponent {
  state = {
    visible: false,
    visible1: false,
    frontVisible: false
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'NameCertification/fetchMyDetails',
      payload: {
        id: this.props.match.params.id,
        level: getParams(this.props.location.search).type
      }
    })
  }

  showModal = (type) => {
    this.setState({
      [type]: true,
    });
  }

  handleOk = (type) => {
    this.setState({
      [type]: false,
    });
  }

  handleCancel = (type) => {
    this.setState({
      [type]: false,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { NameCertification: { aocumentList } } = this.props;
    return (
      <PageHeaderLayout
        title={"审核号:" + aocumentList.application_no}
        logo={
          <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
        }
        content={description(aocumentList, this)}
      >
        <Card title="已验证个人信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="名">{aocumentList.a9}</Description>
            <Description term="中间名">{aocumentList.a10}</Description>
            <Description term="姓">{aocumentList.a11}</Description>
          </DescriptionList>
        </Card>
        <Card title="用户提交信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }} title="地址信息">
            <Description term="地址行1">{aocumentList.a12}</Description>
            <Description term="地址行1">{aocumentList.a13}</Description>
            <Description term="城市">{aocumentList.resident_city}</Description>
            <Description term="省份/州">{aocumentList.resident_province}</Description>
            <Description term="国家">{aocumentList.resident_country}</Description>
            <Description term="邮编">{aocumentList.zip_code}</Description>
          </DescriptionList>
          <Row>
            <Col span={6}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt="example" src={aocumentList.id_document_front} />}
              >
                <Meta
                  title={aocumentList.a18title}
                />
                <a onClick={() => { this.showModal('frontVisible') }}>查看大图</a>
              </Card>
              <Modal
                visible={this.state.frontVisible}
                onCancel={() => { this.handleCancel('frontVisible'); }}
                footer={null}
              >
                <img width="100%" alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />
              </Modal>
            </Col>
          </Row>
        </Card>
        <Modal
          title="查看拒绝理由"
          visible={this.state.visible}
          onOk={() => { this.handleOk('visible') }}
          onCancel={() => { this.handleCancel('visible') }}
        >
          {/* {aocumentList.a90 && aocumentList.a90.map((data, index) => {
            return (
              <p key={index}>理由{index + 1}: {data}</p>
            )
          }
          )} */}
        </Modal>
        <Modal
          title="添加备注"
          visible={this.state.visible1}
          onOk={() => { this.handleOk('visible1') }}
          onCancel={() => { this.handleCancel('visible1') }}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label="备注"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator('note', {
                rules: [{ required: true, message: 'Please input your note!' }],
              })(
                <TextArea rows={4} placeholder="请在此添加备注" />
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
