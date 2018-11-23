import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Popover } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Filter from '../../../filter';
import styles from './index.less';
import { getcurrencyBycode, numberFormat } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const { RangePicker } = DatePicker;
@connect(state => ({
  backManagement: state.backManagement,
}))
@Form.create()
export default class adList extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
    formValues: {},
    page: 1,
    per_page: 10,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'backManagement/fetchLog',
      payload: {
        page: 1,
        per_page: 10,
      },
    });
  }

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
    this.setState({
      page: pagination.current,
      per_page: pagination.pageSize,
    });
    dispatch({
      type: 'backManagement/fetchLog',
      payload: params,
    });
  }

  render() {
    const columns = [
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
    const { backManagement: { loading: logLoading, logList } } = this.props;
    const { selectedRows } = this.state;
    return (
      <PageHeaderLayout title="日志列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={logLoading}
              columns={columns}
              data={logList}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
