import mongoose from '../mongoose';

const { Schema } = mongoose;
const receiveCategorySchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  createdDate: Date,
  modifiedDate: Date,
});
const ReceiveCategory = mongoose.model(
  'ReceiveCategory',
  receiveCategorySchema,
);

export default ReceiveCategory;
