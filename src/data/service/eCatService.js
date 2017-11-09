import { ExpenseCategory, Voucher } from '../mongo/index';
import mongoose from '../mongoose';

const findOrCreateNewExpenseCategory = ({ expenseCategoryName }) =>
  ExpenseCategory.find({ name: expenseCategoryName }).then(list => {
    if (list.length > 0) {
      return list[0];
    }
    const newExpenseCategory = new ExpenseCategory({
      _id: new mongoose.Types.ObjectId(),
      name: expenseCategoryName,
      createdDate: new Date(),
      modifiedDate: new Date(),
    });
    return newExpenseCategory.save();
  });

const getAllExpenseCategoryAndVoucherAggragate = sourceId =>
  Promise.all([
    Voucher.aggregate([
      {
        $match: {
          source: sourceId,
        },
      },
      {
        $group: {
          _id: '$expenseCategory',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]),
    ExpenseCategory.find({ source: sourceId }).exec(),
  ]).then(([sumVoucherArray, listExpense]) => {
    const mapSumVoucher = sumVoucherArray.reduce(
      (last, item) => ({
        ...last,
        [item._id]: item,
      }),
      {},
    );
    // cast mongoose to object width id
    const listExpenseWithCount = listExpense.map(cat => ({
      ...cat.toObject({ getters: true }),
      totalVoucher: mapSumVoucher[cat._id].count,
      totalAmount: mapSumVoucher[cat._id].totalAmount,
    }));
    return listExpenseWithCount;
  });

const eCatService = {
  findOrCreateNewExpenseCategory,
  getAllExpenseCategoryAndVoucherAggragate,
};

export default eCatService;
