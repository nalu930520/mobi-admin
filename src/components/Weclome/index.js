import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

export default ({ className, ...rest }) => {
  const displayImg = 'https://gw.alipayobjects.com/zos/rmsportal/wZcnGqRDyhPOEYFcZDnb.svg'
  const clsString = classNames(styles.exception, className);
  return (
    <div className={clsString} {...rest}>
      <div className={styles.content}>
        <div className={styles.desc}>欢迎来到主页，请找管理员添加您的权限。</div>
      </div>
      <div className={styles.imgBlock}>
        <div
          className={styles.imgEle}
          style={{ backgroundImage: `url(${displayImg})` }}
        />
      </div>
    </div>
  );
};
