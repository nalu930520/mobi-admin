import React, { Component } from 'react';
import { Card, Avatar, Dropdown, Menu } from 'antd';
import c2cIcon from '../../assets/C2C.png';
import platformIcon from '../../assets/platformManage.png';
import userIcon from '../../assets/userManage.png';
import transactionIcon from '../../assets/transactionManage.png';
import backIcon from '../../assets/backManager.png';
import hedging from '../../assets/hedging.png';
import financial from '../../assets/financial.png';
import bft from '../../assets/bft.png';
import cash from '../../assets/cash.png';
import s from './index.less';

const { Meta } = Card;
export default class ModelCard extends Component {
  render() {
    const { title, featureList } = this.props;
    let avatar = '';
    let description = '';
    switch (title) {
      case 'Mobi C2C':
        avatar = c2cIcon;
        description = 'C2C模块用户管理、广告管理、订单管理、申诉管理及C2C全局设置。';
        break;
      case '平台资产管理':
        avatar = platformIcon;
        description = '查看当前平台资产与历史变更情况，管理平台汇率及查看历史兑换情况。';
        break;
      case '用户管理':
        avatar = userIcon;
        description = '查看平台注册用户及用户详细信息，管理用户账户信息。';
        break;
      case '交易管理':
        avatar = transactionIcon;
        description = '查看交易列表及查询单笔交易详细信息。';
        break;
      case '后台管理':
        avatar = backIcon;
        description = '后台用户群组及权限管理，查看后台用户操作日志，调整应用全局设置。';
        break;
      case '对冲管理':
        avatar = hedging;
        description = '实时监控平台兑换信息，查看历史对冲记录及管理对冲有关系统设置。';
        break;
      case '财务管理':
        avatar = financial;
        description = '集成各功能模块所涉及的财务收入报表、对账报表等。';
        break;
      case '现金充提':
        avatar = cash;
        description = '添加，查看现金充值和提现。';
        break;
      case '币丰堂':
        avatar = bft;
        description = '转入转出记录，币丰堂设置。';
        break;
      default:
        break;
    }
    const menu = (
      <Menu>
        {featureList.map((data) => {
          if (data.children) {
            return data.children.map(childrenData => (
              <Menu.Item key={childrenData.name}>
                <a target="_blank" rel="noopener noreferrer" href={childrenData.path}>{childrenData.name}</a>
              </Menu.Item>
            ));
          } else {
            return (
              <Menu.Item key={data.name}>
                <a target="_blank" rel="noopener noreferrer" href={data.path}>{data.name}</a>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    );
    const newList = [];

    featureList.forEach((element) => {
      if (element.children) {
        element.children.forEach((childElement) => {
          newList.push(childElement);
        });
      }
      newList.push(element);
    });
    return (
      <div className={s.cardWraper}>
        <Card
          actions={[<a href={newList[0].path}>{newList[0].name}</a>, <Dropdown overlay={menu} placement="topCenter" ><span>更多操作</span></Dropdown>]}
        >
          <Meta
            avatar={<img alt="title" src={avatar} style={{ width: '50px' }} />}
            title={title}
            description={description}
          />
        </Card>
      </div>
    );
  }
}
