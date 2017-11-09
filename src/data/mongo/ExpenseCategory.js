import mongoose from '../mongoose';

const { Schema } = mongoose;

const expenseCategorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  createdDate: Date,
  modifiedDate: Date,
  source: { type: Schema.Types.ObjectId, ref: 'SourceVoucher' },
});
const ExpenseCategory = mongoose.model(
  'ExpenseCategory',
  expenseCategorySchema,
);
export default ExpenseCategory;
