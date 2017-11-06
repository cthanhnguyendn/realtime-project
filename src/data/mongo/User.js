import mongoose from '../mongoose';

const { Schema } = mongoose;
const usersSchema = new Schema({
  _id: Schema.Types.ObjectId,
  email: String,
  password: String,
  emailConfirmed: Boolean,
  passwordHasSet: Boolean,
  cratedDate: Date,
  userClaim: [
    new Schema({
      type: String,
      key: String,
    }),
  ],
  userLogin: [
    new Schema({
      type: String,
      key: String,
    }),
  ],
  profile: new Schema({
    email: String,
    displayName: String,
    picture: String,
    gender: String,
    location: String,
  }),
});

const User = mongoose.model('User', usersSchema);
export default User;
