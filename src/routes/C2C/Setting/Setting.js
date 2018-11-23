import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Icon, Card, Input, Form } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import DescriptionList from '../../../components/DescriptionList';
import styles from './Setting.less';

const { Description } = DescriptionList;

// const action = (_this, dispatch) => (
//   <div>
//     <Button
//       type="primary"
//       onClick={() => {
//         if (_this.state.disableInput === true) {
//             _this.setState({
//               disableInput: false,
//             });
//           } else {
//             {/* dispatch({ type: 'setting/saveSetting', payload; }) */}
//             _this.props.form.validateFieldsAndScroll((err, values) => {
//               dispatch({ type: 'setting/saveSetting', payload: values });
//             })
//       }}
//     >{_this.state.disableInput === true ? '设置' : '提交'}
//     </Button>
//   </div>
// );
const setSetting = (_this, settingName, dispatch) => {
  if (_this.state[settingName] === true) {
    _this.setState({
      [settingName]: false,
    });
  } else {
    let reqData = {};
    _this.props.form.validateFieldsAndScroll((err, values) => {
      if (settingName === 'transaction_fee_rate') {
        reqData = {
          field_name: 'transaction_fee_rate',
          value: values.transaction_fee_rate / 100,
        };
      } else {
        reqData = {
          field_name: 'user_cancel_punishment',
          value: {
            cancel_max_count: values.cancel_max_count,
            block_time_delta: values.block_time_delta * 60,
          },
        };
      }
      dispatch({ type: 'setting/saveSetting', payload: reqData })
        .then(() => {
          _this.setState({
            transaction_fee_rate: true,
            cancel_max_count: true,
            block_time_delta: true,
          });
        });
    });
  }
};

const normalizeNmuber = (value, prevValue) => {
  console.log(value);
  if (!value) return value;
  if (/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(value)) {
    return value;
  }
  return prevValue;
};

const description = (_this, allSetting, getFieldDecorator) => (
  <DescriptionList className={styles.headerList} size="small" col="2">
    <Form layout="inline">
      <Description term="全局手续费">
        {getFieldDecorator('transaction_fee_rate', {
          initialValue: allSetting.transaction_fee_rate * 100,
          normalize: normalizeNmuber,
        })(
          <Input
            style={{ width: '50px' }}
            disabled={_this.state.transaction_fee_rate}
          />
        )}
        {' %'}
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          onClick={() => {
            setSetting(_this, 'transaction_fee_rate', _this.props.dispatch);
          }}
        >{_this.state.transaction_fee_rate === true ? '设置' : '完成'}
        </Button>
      </Description>
      <Description term="取消次数">
        {getFieldDecorator('cancel_max_count',
        {
            initialValue: allSetting.user_cancel_punishment.cancel_max_count,
            normalize: normalizeNmuber,
        })(
          <Input
            style={{ width: '50px' }}
            disabled={_this.state.cancel_max_count}
          />
        )}
        {'次'}
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          onClick={() => {
            setSetting(_this, 'cancel_max_count', _this.props.dispatch);
          }}
        >{_this.state.cancel_max_count === true ? '设置' : '完成'}
        </Button>
      </Description>
      <Description term="取消惩罚时长">
        {getFieldDecorator('block_time_delta',
        {
            initialValue: allSetting.user_cancel_punishment.block_time_delta / 60,
            normalize: normalizeNmuber,
        })(
          <Input
            style={{ width: '50px' }}
            disabled={_this.state.block_time_delta}
          />
        )}
        {'mins'}
        <Button
          type="primary"
          style={{ marginLeft: '20px' }}
          onClick={() => {
            setSetting(_this, 'block_time_delta', _this.props.dispatch);
          }}
        >{_this.state.block_time_delta === true ? '设置' : '完成'}
        </Button>
      </Description>
    </Form>

  </DescriptionList>
);

@connect(state => ({
  setting: state.setting,
}))
@Form.create()
export default class Setting extends Component {
  state = {
    transaction_fee_rate: true,
    cancel_max_count: true,
    block_time_delta: true,
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/fetch',
    });
  }
  render() {
    const { dispatch, setting } = this.props;
    const { allSetting } = setting;
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderLayout
        content={description(this, allSetting, getFieldDecorator)}
      />
    );
  }
}
