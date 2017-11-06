import { GraphQLList } from 'graphql';
import { ExpenseCategoryType } from '../types/index';
import { ExpenseCategory, Voucher } from '../mongo/index';

const expenseCategory = {
  type: new GraphQLList(ExpenseCategoryType),
  resolve() {
    return Promise.all([
      Voucher.aggregate([
        {
          $group: {
            _id: '$expenseCategory',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
      ExpenseCategory.find({}).exec(),
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
  },
};
export default expenseCategory;
