import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Card, List, Avatar } from 'antd';
import store from 'store';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ModelCard from '../../components/ModelCard';
import styles from './index.less';
import userAvatar from '../../assets/avator.png';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

@connect(state => ({
  workplace: state.workplace,
}))
export default class Workplace extends PureComponent {
  componentDidMount() {

  }

  render() {
    const { rolename, username, dashboardPermession } = this.props.workplace;
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar size="large" src={userAvatar} />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>Hi {username} ，祝你开心每一天！</div>
          <div>所属群组：{rolename}</div>
        </div>
      </div>
    );
    console.log('dashboardPermession123:', dashboardPermession)
    return (
      <PageHeaderLayout
        content={pageHeaderContent}
      >
        <Row gutter={24}>
          {dashboardPermession.map(data => (
            <Col {...topColResponsiveProps} key={data.name}>
              <ModelCard
                title={data.name}
                featureList={data.children || []}
              />
            </Col>
          ))}
        </Row>
      </PageHeaderLayout>
    );
  }
}
