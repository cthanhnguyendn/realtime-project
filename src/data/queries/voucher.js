import { GraphQLList } from 'graphql';
import VoucherType from '../types/VoucherType';
import { VoucherService } from '../service';

const voucher = {
  type: new GraphQLList(VoucherType),
  resolve(source) {
    const sourceId = source.id;
    return VoucherService.findBySourceId(sourceId)
      .populate('expenseCategory')
      .populate('receiveCategory');
  },
};
export default voucher;
