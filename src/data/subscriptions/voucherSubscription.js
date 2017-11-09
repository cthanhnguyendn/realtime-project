import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLObjectType,
} from 'graphql';
import { withFilter } from 'graphql-subscriptions';
import { VoucherType } from '../types';
import { pubsub } from '../subscriptEngine';

const VOUCHER_ADDED_TOPIC = 'voucherAdded';
const publishAddVoucher = payload =>
  pubsub.publish(VOUCHER_ADDED_TOPIC, payload);

const addVoucher = {
  type: VoucherType,
  subscribe: withFilter(
    () => pubsub.asyncIterator(VOUCHER_ADDED_TOPIC),
    (payload, args, request) => {
      const { user } = request;
      const { voucher } = payload;
      return true;
    },
  ),
};
export default addVoucher;
export { publishAddVoucher };
