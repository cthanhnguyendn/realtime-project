import mongoose from '../mongoose';

const { Schema } = mongoose;
const voucherSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  amount: Number,
  applyDate: Date,
  createDate: Date,
  modifiedDate: Date,
  expenseCategory: { type: Schema.Types.ObjectId, ref: 'ExpenseCategory' },
  receiveCategory: { type: Schema.Types.ObjectId, ref: 'ReceiveCategory' },
  source: { type: Schema.Types.ObjectId, ref: 'SourceVoucher' },
});
const Voucher = mongoose.model('Vouncher', voucherSchema);

export default Voucher;
