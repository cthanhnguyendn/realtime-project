/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  GraphQLSchema as Schema,
  GraphQLObjectType as ObjectType,
} from 'graphql';

import me from './queries/me';
import news from './queries/news';
import data from './queries/data';
import voucherMutation from './mutations/voucher';
import addVoucher from './subscriptions/voucherSubscription';

const schema = new Schema({
  query: new ObjectType({
    name: 'Query',
    fields: {
      me,
      news,
      data,
    },
  }),
  mutation: new ObjectType({
    name: 'Mutation',
    fields: {
      voucherMutation,
    },
  }),
  subscription: new ObjectType({
    name: 'Subscription',
    fields: {
      addVoucher,
    },
  }),
});

export default schema;
