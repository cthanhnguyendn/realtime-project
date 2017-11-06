import { Voucher } from '../mongo/index';
import mongoose from '../mongoose';

const createNewVoucher = ({
  title,
  amount,
  expenseCategoryId,
  receiveCategoryId,
}) => {
  const newVoucher = new Voucher({
    _id: new mongoose.Types.ObjectId(),
    title,
    amount,
    expenseCategory: expenseCategoryId,
    receiveCategory: receiveCategoryId,
    createdDate: new Date(),
    modifiedDate: new Date(),
  });
  return newVoucher.save().then(() =>
    Voucher.findById(newVoucher._id)
      .populate('expenseCategory')
      .populate('receiveCategory'),
  );
};

const deleteVoucher = id =>
  Voucher.remove({ _id: new mongoose.Schema.ObjectId(id) });

const VouncherService = {
  createNewVoucher,
  deleteVoucher,
};

export default VouncherService;
