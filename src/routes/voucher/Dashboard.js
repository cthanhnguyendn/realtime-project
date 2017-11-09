/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Voucher.css';
import newsQuery from './voucher.graphql';

class Dashboard extends React.Component {
  static propTypes = {
    news: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
        content: PropTypes.string,
      }),
    ).isRequired,
  };

  render() {
    const { data: { loading, news } } = this.props;
    return (
      <div className={s.dashboardContainer}>
        <div className={`${s.sideSelect} p-2`}>
          <div className="small-label">Thời gian hiển thị</div>
        </div>
        <div className={s.middleInfo} />
        <div className={s.voucherList} />
      </div>
    );
  }
}

export default compose(withStyles(s), graphql(newsQuery))(Dashboard);
