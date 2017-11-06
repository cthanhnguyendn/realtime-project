import { ReceiveCategory, Voucher } from '../mongo/index';
import mongoose from '../mongoose';

const getAllRecieveCategoryAndVoucherAggragate = () =>
  Promise.all([
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

const findOrCreateNewReceiveCategoryName = ({ receiveCategoryName }) =>
  ReceiveCategory.find({ name: receiveCategoryName }).then(list => {
    if (list.length > 0) {
      return list[0];
    }
    const newReceiveCategory = new ReceiveCategory({
      _id: new mongoose.Types.ObjectId(),
      name: receiveCategoryName,
      createdDate: new Date(),
      modifiedDate: new Date(),
    });
    return newReceiveCategory.save();
  });

const RCatService = {
  getAllRecieveCategoryAndVoucherAggragate,
  findOrCreateNewReceiveCategoryName,
};
export default RCatService;
