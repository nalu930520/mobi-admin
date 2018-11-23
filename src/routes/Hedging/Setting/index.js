import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Tabs, Button, Modal, Form, Input, message, Popover } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import StandardTable from '../../../components/StandardTable';

const { TabPane } = Tabs;
const FormItem = Form.Item;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 },
};
const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleModalVisible, handleAdd, editInfo, isEdit } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue, isEdit, editInfo);
    });
  };
  return (
    <Modal
      title="添加/编辑外部平台"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      onOk={okHandle}
      // onCancel={() => {
      //   this.setState({
      //     showAddPlatform: false,
      //   });
      // }}
    >
      <Form layout="horizontal">
        <FormItem label="平台名称" {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: isEdit ? editInfo.name : '',
          })(
            <Input />
          )}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('note_data', {
            initialValue: isEdit ? editInfo.des : '',
          })(<TextArea rows={3} />)}
        </FormItem>
      </Form>
    </Modal>
  );
});

const normalizeNmuber = (value, prevValue) => {
  if (!value) return value;
  if (/^[0-9]+\.?[0-9]{0,9}$/.test(value)) {
    return value;
  }
  return prevValue;
};

const BPIcolumns = [
  {
    title: '操作时间',
    render: record => (
      <span>
        {moment.unix(record.created_at).format('YYYY-MM-DD HH:mm:ss')}
      </span>
    ),
  },
  {
    title: '类型',
    dataIndex: 'operation_name',
  },
  {
    title: '手机号码',
    render: record => (
      <span>
        {record.mobile_code} {record.mobile}
      </span>
    ),
  },
  {
    title: '修改前',
    render: record => (
      <Popover content={record.previous_data}>
        <Button type="primary">查看详情</Button>
      </Popover>
    ),
  },
  {
    title: '修改后',
    render: record => (
      <Popover content={record.current_data}>
        <Button type="primary">查看详情</Button>
      </Popover>
    ),
  },
  {
    title: '操作人',
    dataIndex: 'email',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

@Form.create()
@connect(state => ({
  hedging: state.hedging,
}))
export class Setting extends Component {
  state = {
    modalVisible: false,
    editObj: {},
    isEdit: false,
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'hedging/fetchPlatform',
      payload: {
        page: 1,
        per_page: 10,
      },
    });
  }
  handleAdd = (fields, isEdit, editInfo) => {
    const data = fields;
    if (isEdit) {
      data.id = editInfo.id;
    }
    this.props.dispatch({
      type: `hedging/${isEdit ? 'editPlatform' : 'addPlatform'}`,
      payload: data,
    });
    message.success(isEdit ? '编辑成功' : '添加成功');
    this.setState({
      modalVisible: false,
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleStandardTableChange = (pagination, effectsName) => {
    const { dispatch } = this.props;

    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
    };

    dispatch({
      type: `hedging/${effectsName}`,
      payload: params,
    });
  }
  tabCallback = (key) => {
    const { dispatch } = this.props;
    if (key === '1') {
      dispatch({
        type: 'hedging/fetchPlatform',
        payload: {
          page: 1,
          per_page: 10,
        },
      });
    }
    if (key === '2') {
      dispatch({ type: 'hedging/fetchBPI' });
      dispatch({
        type: 'hedging/fetchBPILog',
        payload: {
          page: 1,
          per_page: 10,
        },
      });
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'hedging/updateBPI',
          payload: {
            value: values.value,
          },
        });
      }
    });
  }
  checkBPIValue = (rule, value, callback) => {
    if (value >= 0.8 && value <= 1.2) {
      callback();
      return;
    }
    callback('number must in 0.8 - 1.2');
  }
  render() {
    const { data, loading, BPIValue } = this.props.hedging;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      { title: '创建时间',
        render: val => (<span>{moment.unix(val.created_at).format('YYYY-MM-DD HH:mm:ss')}</span>),
      }, {
        title: '外部平台名称',
        dataIndex: 'name',
      }, {
        title: '描述',
        dataIndex: 'note_data',
      }, {
        title: '操作人',
        dataIndex: 'user_name',
      }, {
        title: '操作',
        render: val => (
          <a
            onClick={() => {
              this.setState({
                isEdit: true,
                editObj: {
                  name: val.name,
                  des: val.note_data,
                  id: val.id,
                },
              });
              this.handleModalVisible(true);
            }}
          >编辑
          </a>
        ),
      },
    ];
    return (
      <div>
        <PageHeaderLayout title="设置">
          <Card>
            <Tabs
              defaultActiveKey="1"
              onChange={this.tabCallback}
            >
              <TabPane tab="外部平台配置" key="1">
                <Button
                  type="primary"
                  icon="plus"
                  onClick={() => {
                    this.handleModalVisible(true);
                    this.setState({
                      isEdit: false,
                    });
                  }}
                  style={{ marginBottom: '15px' }}
                >
                新建
                </Button>
                <StandardTable
                  selectedRows={[]}
                  columns={columns}
                  loading={loading}
                  data={data}
                  onChange={(pagination) => {
                    this.handleStandardTableChange(pagination, 'fetchPlatform');
                  }}
                />
                <CreateForm
                  handleModalVisible={this.handleModalVisible}
                  handleAdd={this.handleAdd}
                  modalVisible={this.state.modalVisible}
                  editInfo={this.state.editObj}
                  isEdit={this.state.isEdit}
                />
              </TabPane>
              <TabPane tab="BPI 参数调整" key="2">
                <Form layout="inline" onSubmit={this.handleSubmit}>
                  <FormItem label="BPI 设置：">
                    {getFieldDecorator('value', {
                      initialValue: BPIValue,
                      normalize: normalizeNmuber,
                      rules: [
                        { max: 5, message: '' },
                        { validator: this.checkBPIValue },
                      ],
                    })(
                      <Input
                        style={{ width: '165px' }}
                      />
                    )}
                  </FormItem>
                  <FormItem>
                    <Button
                      type="primary"
                      style={{ marginBottom: '15px' }}
                      htmlType="submit"
                    >修改
                    </Button>
                  </FormItem>
                </Form>
                <StandardTable
                  selectedRows={[]}
                  columns={BPIcolumns}
                  loading={loading}
                  data={data}
                  onChange={(pagination) => {
                    this.handleStandardTableChange(pagination, 'fetchBPILog');
                  }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </PageHeaderLayout>
      </div>
    );
  }
}

export default Setting;
