import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Button } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './index.less';
import ChangeSettingModal from './BussinessSettingModal';

const FormItem = Form.Item;
@connect(state => ({
  bussinessSetting: state.bussinessSetting,
}))
@Form.create()
export default class depositList extends PureComponent {
  state = {
    commissionFlg: false,
    USDTUpperFlg: false,
    // minUSDTFlg: false,
    // maxUSDTFlg: false,
    modalVisible: false,
    modalKey: '',
    modalName: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取初始值
    dispatch({
      type: 'bussinessSetting/fetchBussinessSetting',
    });
  }
  // 设置
  setLimit = (key, title) => {
    this.setState({
      modalVisible: true,
      modalKey: key,
      modalName: title,
    });
  }
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  }

  renderOption() {
    const { setConfig } = this.props.bussinessSetting;
    const { commissionFlg, USDTUpperFlg, modalVisible, modalName, modalKey } = this.state;
    const list = [{
      label: '手续费费率:',
      key: 'transaction_fee_rate',
      editFlg: 'commissionFlg',
      commissionFlg,
      unit: '%',
      modalTitle: '修改手续费费率',
    },
    {
      label: 'USDT溢价率:',
      key: 'premium_rate',
      editFlg: 'USDTUpperFlg',
      USDTUpperFlg,
      unit: '%',
      modalTitle: '修改溢价率',
    },
    // {
    //   label: 'USDT最小购买数量:',
    //   key: 'minUSDT',
    //   editFlg: 'minUSDTFlg',
    //   minUSDTFlg,
    //   unit: 'USDT',
    // },
    // {
    //   label: 'USDT最大购买数量:',
    //   key: 'maxUSDT',
    //   editFlg: 'maxUSDTFlg',
    //   maxUSDTFlg,
    //   unit: 'USDT',
    //   modalTitle: '修改购买额度',
    // }
    ];
    return (
      <div>
        {list.map((item, index) =>
          (<Row gutter={16} key={index}>
            <Col className="gutter-row" span={14}>
              <FormItem label={item.label}>
                <Row>
                  <span className={styles.valueContain}>{setConfig[item.key]}&nbsp;{item.unit}</span>

                  {index !== 2 &&
                    <Button type="primary" onClick={() => { this.setLimit(item.key, item.modalTitle); }}>修改</Button>
                  }
                </Row>
              </FormItem>
            </Col>
           </Row>)
          )
        }
        {modalVisible && <ChangeSettingModal
          visible={modalVisible}
          modalName={modalName}
          modalKey={modalKey}
          handleCancel={() => { this.handleCancel(); }}
        />}
      </div>
    );
  }
  render() {
    return (
      <PageHeaderLayout title="设置">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderOption()}
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
