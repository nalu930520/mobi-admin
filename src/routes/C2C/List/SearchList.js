import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Button, message, Table } from 'antd';
import styles from './SearchList.less';

const InputGroup = Input.Group;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  customer: state.customer,
}))
@Form.create()
export default class SearchList extends PureComponent {
  state = {
    addInputValue: '',
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      page: pagination.current,
      per_page: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'customer/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'customer/fetch',
      payload: {},
    });
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fieldsValue.value) {
        return;
      }
      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      const params = {
        page: 1,
        per_page: 10,
      };

      switch (values.key) {
        case 'id':
          dispatch({
            type: 'customer/fetchPhoneNumber',
            payload: {
              mobi_id: values.value,
            },
          });
          break;
        case 'mobile':
          dispatch({
            type: 'customer/fetchPhoneNumber',
            payload: {
              ...params,
              mobile: values.value,
            },
          });
          break;
        default:
          break;
      }

      // if (values.id) {
      //   dispatch({
      //     type: 'customer/fetchID',
      //     payload: {
      //       id: values.id,
      //     },
      //   });
      // }
      // if (values.mobile) {
      //   dispatch({
      //     type: 'customer/fetchPhoneNumber',
      //     payload: {
      //       mobile: values.mobile,
      //     },
      //   });
      // }
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAddInput = (e) => {
    this.setState({
      addInputValue: e.target.value,
    });
  }

  handleAdd = () => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: this.state.addInputValue,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={10} sm={24}>
            <InputGroup compact style={{ marginBottom: 20 }}>
              {getFieldDecorator('key', {
                initialValue: 'mobile',
              })(
                <Select style={{ width: '20%' }}>
                  <Option value="id">Mobi ID</Option>
                  <Option value="mobile">手机号</Option>
                </Select>
              )}
              {getFieldDecorator('value')(
                <Input style={{ width: '80%' }} placeholder="请输入" />
              )}
            </InputGroup>
          </Col>
          <Col md={14} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { customer: { loading: customerLoading, customerList, columns } } = this.props;
    return (
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            {this.renderForm()}
          </div>
          <Table
            loading={customerLoading}
            columns={columns}
            dataSource={customerList.list}
            pagination={false}
            rowKey="mobi_id"
          />
        </div>
      </Card>
    );
  }
}
