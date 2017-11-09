import { Source } from '../mongo';
import mongoose from '../mongoose';

const getUserSourceVoucher = id => Source.find({ 'participant.user': id });
const findOrCreateDefault = userId =>
  Source.findOne({
    'participant.user': userId,
  }).then(source => {
    if (!source) {
      const defaultSource = new Source({
        _id: new mongoose.Types.ObjectId(),
        createDate: new Date(),
        modifiedDate: new Date(),
        participant: [
          {
            user: userId,
            isAdmin: true,
          },
        ],
      });
      return defaultSource.save().then(() => defaultSource);
    }
    return source;
  });

const findById = id => Source.find({ 'participant.user': id });
const sourceService = {
  getUserSourceVoucher,
  findOrCreateDefault,
  findById,
};

export default sourceService;
