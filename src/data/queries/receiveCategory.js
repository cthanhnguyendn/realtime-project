import { GraphQLList } from 'graphql';
import { ReceiveCategoryType } from '../types/index';
import { ReceiveCategory, Voucher } from '../mongo/index';

const receiveCategory = {
  type: new GraphQLList(ReceiveCategoryType),
  resolve() {
    return Promise.all([
      Voucher.aggregate([
        {
          $group: {
            _id: '$receiveCategory',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
      ReceiveCategory.find({}),
    ]).then(([sumVoucherArray, listReceive]) => {
      const mapSumVoucher = sumVoucherArray.reduce(
        (last, item) => ({
          ...last,
          [item._id]: item,
        }),
        {},
      );
      // cast mongoose to object width id
      const listCatWithCount = listReceive.map(cat => ({
        ...cat.toObject({ getters: true }),
        totalVoucher: mapSumVoucher[cat._id].count,
        totalAmount: mapSumVoucher[cat._id].totalAmount,
      }));
      return listCatWithCount;
    });
  },
};
export default receiveCategory;
