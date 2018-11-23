import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Card, Form, Input, Select, Button, DatePicker, Table, Checkbox, Tree } from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Filter from '../../../filter';
import styles from './index.less';
import { getcurrencyBycode, numberFormat } from '../../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const { RangePicker } = DatePicker;
const { TreeNode } = Tree;

@connect(state => ({
  backManagement: state.backManagement,
}))
@Form.create()
export default class addOrEditRole extends Component {
  state = {
    expandedKeys: [],
    autoExpandParent: true,
    checkedKeys: this.props.backManagement.checkKeys || [],
    selectedKeys: [],
  }
  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps) {
    if ('backManagement' in nextProps) {
      this.setState({
        checkedKeys: nextProps.backManagement.checkKeys,
      });
    }
  }

  onExpand = (expandedKeys) => {
    console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }
  submitRole = () => {
    const { dispatch, backManagement } = this.props;
    const { roleList, roleName } = backManagement;
    const selectKey = this.state.checkedKeys;
    console.log('selectKey', selectKey);
    const add_permission_ids = [];
    const permissionList = [];
    roleList.forEach((item) => {
      item.children.forEach((child) => {
        if (child.permission === true) {
          permissionList.push(child);
        }
        selectKey.forEach((key) => {
          if (key === child.key && !child.permission) {
            add_permission_ids.push(child.id);
          }
        });
        // if (key !== child.key && child.permission) {
        //   remove_permission_ids.push(child.id);
        // }
      });
    });
    console.log(permissionList);
    const remove_permission_ids = permissionList.filter(child => !selectKey.includes(child.key))
      .map(child => child.id);
    console.log('remove', remove_permission_ids);
    console.log('add', add_permission_ids);
    dispatch({ type: 'backManagement/editRole', payload: { remove_permission_ids, add_permission_ids, rolename: roleName } });
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  render() {
    // const { getFieldDecorator } = this.props.form;
    const { backManagement } = this.props;
    const { roleName, roleList, checkKeys } = backManagement;
    return (
      <Card title="添加/编辑权限">
        <Row justify="space-between" gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <p>角色群组：{roleName}</p>
          </Col>
          <Col md={12} sm={24}>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              style={{ marginRight: '15px' }}
              onClick={this.submitRole}
            >提交
            </Button>
          </Col>
        </Row>
        <Tree
          checkable
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
          onSelect={this.onSelect}
          selectedKeys={this.state.selectedKeys}
        >
          {this.renderTreeNodes(roleList)}
        </Tree>
      </Card>
    );
  }
}
