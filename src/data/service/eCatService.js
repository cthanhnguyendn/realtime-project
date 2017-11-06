import { ExpenseCategory } from '../mongo/index';
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

const eCatService = {
  findOrCreateNewExpenseCategory,
};

export default eCatService;
