import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Icon, Divider } from 'antd';
import SearchList from '../List/SearchList';
import DescriptionList from '../../../components/DescriptionList';

const { Description } = DescriptionList;

class Dashboard extends PureComponent {
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'user/fetch',
    // });
  }
  render() {
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 6,
      xl: 6,
      style: { marginBottom: 24 },
    };
    const { complaintOrders, orders, ads } = this.props.dashboard;

    return (
      <div>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <Card bordered={false}>
              <h4>全站广告记录</h4>
              <DescriptionList size="small" col="1">
                <Description term="激活">{ads.ad_online_count}</Description>
                <Description term="未激活">{ads.ad_offline_count}</Description>
              </DescriptionList>
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card bordered={false}>
              <h4>全站订单记录</h4>
              <DescriptionList size="small" col="1">
                <Description term="进行中">{orders.processing_count}</Description>
                <Description term="已完成">{orders.done_count}</Description>
              </DescriptionList>
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card bordered={false}>
              <h4>申诉请求</h4>
              <DescriptionList size="small" col="1">
                <Description term="待处理">{complaintOrders.waiting_process_count}</Description>
                <Description term="进行中">{complaintOrders.processing_count}</Description>
              </DescriptionList>
            </Card>
          </Col>
          <Col {...topColResponsiveProps}>
            <Card bordered={false}>
              <h4>设置</h4>
            </Card>
          </Col>
        </Row>
         <SearchList />
      </div>
    );
  }
}

export default connect(state => ({
  dashboard: state.dashboard,
}))(Dashboard);
