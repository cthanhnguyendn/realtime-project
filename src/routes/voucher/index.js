import React from 'react';
import Layout from '../../components/Layout';
import Dashboard from './Dashboard';

const title = 'Voucher Dash Board';

function action({ params, fetch }, { idsource }) {
  return {
    chunks: ['voucher'],
    title,
    component: (
      <Layout>
        <Dashboard idsource={idsource} title={title} fetch={fetch} />
      </Layout>
    ),
  };
}

export default action;
