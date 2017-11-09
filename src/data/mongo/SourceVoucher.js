import mongoose from '../mongoose';

const { Schema } = mongoose;
const sourceVoucherSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  createDate: Date,
  modifiedDate: Date,
  participant: [
    new Schema({
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      isAdmin: Boolean,
    }),
  ],
});
const SourceVoucher = mongoose.model('SourceVouncher', sourceVoucherSchema);

export default SourceVoucher;
