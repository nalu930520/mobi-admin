import React, { PureComponent } from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import filter from 'lodash.filter';
import logo from '../../assets/logo_white.png';
import styles from './index.less';
import store from 'store';

const { Sider } = Layout;
const { SubMenu } = Menu;

function hideRootSideBarIfAllLeafIsHide(child) {
  // 深度优先
  const filteringChild = child.filter(e => e.children);
  for (const e of filteringChild) {
    for (const p of e.children) {
      if (p.children) {
        p.show = p.children.some(leaf => leaf.show === true);
      }
    }
  }
  for (const e of filteringChild) {
    e.show = e.children.some(leaf => leaf.show === true);
  }

  save(filteringChild);
}

function hideLeafSideBarIfHasNoPermission(child) {
  const permissions = store.get('userPermissions');
  for (const { children } of child.filter(e => e.children)) {
    for (let e of children) {
      const { children, show, permissionUrl, permissionMethod } = e
      if (show === false || show === undefined) {
        continue;
      }
      if (children) {
        iterateChildElements(children, permissions);
      } else {
        const pMethod = permissionMethod || 'GET';
        for (const { endpoint, method, permission } of permissions) {
          if (permissionUrl === endpoint && method === pMethod) {
            e.show = permission;
          }
        }
      }
    }
  }
}

function iterateChildElements(children, allPermissions) {
  for (let e of children) {
    const { permissionUrl, show, permissionMethod } = e
    if (show === false || show === undefined) {
      continue;
    }
    const pMethod = permissionMethod || 'GET';
    for (const { endpoint, method, permission } of allPermissions) {
      if (permissionUrl === endpoint && method === pMethod) {
        e.show = permission;
      }
    }
  }
}

function save(child) {
  const dashboardPermissions = child.filter(root => root.show && root.children).map((root) => {
    const { name, path, children } = root
    const eachRootBar = {
      root_name: name,
      leaves: [],
    };

    for (const leaf of children) {
      if (!leaf.show) {
        continue;
      }
      if (leaf.children) {
        const elements = leaf.children.filter(leafChild => leafChild.show).map((leafChild) => {
          return {
            leaf_name: leafChild.name,
            url: `/${path}/${leafChild.path}`,
          };
        })
        eachRootBar.leaves.push(...elements);
      } else {
        eachRootBar.leaves.push({
          leaf_name: leaf.name,
          url: `/${path}/${leaf.path}`,
        });
      }
    }
    return eachRootBar;
  });
  store.set('dashboardPermissions', dashboardPermissions);
}

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    // 把一级 Layout 的 children 作为菜单项
    this.menus = props.navData.reduce((arr, current) => arr.concat(current.children), []);
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }
  onCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  getDefaultCollapsedSubMenus(props) {
    const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
    currentMenuSelectedKeys.splice(-1, 1);
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }
    return currentMenuSelectedKeys;
  }
  getCurrentMenuSelectedKeys(props) {
    const { location: { pathname } } = props || this.props;
    const keys = pathname.split('/').slice(1);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].key];
    }
    return keys;
  }
  getNavMenuItems(menusData, parentPath = '') {
    if (!menusData) {
      return [];
    }

    return filter(menusData, { show: true }).map((item) => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return (
          <SubMenu
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
            key={item.key || item.path}
          >
            {this.getNavMenuItems(item.children, itemPath)}
          </SubMenu>
        );
      }
      const icon = item.icon && <Icon type={item.icon} />;
      return (
        <Menu.Item key={item.key || item.path}>
          {
            /^https?:\/\//.test(itemPath) ? (
              <a href={itemPath} target={item.target}>
                {icon}<span>{item.name}</span>
              </a>
            ) : (
              <Link
                to={itemPath}
                target={item.target}
                replace={itemPath === this.props.location.pathname}
              >
                {icon}<span>{item.name}</span>
              </Link>
            )
          }
        </Menu.Item>
      );
    });
  }
  handleOpenChange = (openKeys) => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(
      item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  }
  render() {
    const { collapsed } = this.props;
    // Don't show popup menu when it is been collapsed
    const menuProps = collapsed ? {} : {
      openKeys: this.state.openKeys,
    };

    if (store.get('userPermissions')) {
      hideLeafSideBarIfHasNoPermission(this.menus);
      hideRootSideBarIfAllLeafIsHide(this.menus);
    }
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="md"
        onCollapse={this.onCollapse}
        width={256}
        className={styles.sider}
      >
        <div className={styles.logo}>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          {...menuProps}
          onOpenChange={this.handleOpenChange}
          selectedKeys={this.getCurrentMenuSelectedKeys()}
          style={{ padding: '16px 0', width: '100%' }}
        >
          {this.getNavMenuItems(this.menus)}
        </Menu>
      </Sider>
    );
  }
}
