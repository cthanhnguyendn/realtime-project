import { GraphQLList } from 'graphql';
import VoucherType from '../types/VoucherType';
import Voucher from '../mongo/Voucher';

const voucher = {
  type: new GraphQLList(VoucherType),
  resolve() {
    return Voucher.find({})
      .populate('expenseCategory')
      .populate('receiveCategory');
  },
};
export default voucher;
