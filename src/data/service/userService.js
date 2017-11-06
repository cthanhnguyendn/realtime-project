import { Users } from '../mongo';
import bcrypt from 'bcrypt-nodejs';
import mongoose from '../mongoose';

const hashPassword = password =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

const findUserByEmail = email => Users.findOne({ email });
const findUserByEmailAndPassword = (email, password) => {
  const passwordHash = hashPassword(password);
  return Users.findOne({ email, password: passwordHash }).then(
    user => (user ? user.toObject({ getter: true }) : null),
  );
};

const createUserByEmailAndPassword = (email, password) => {
  const passwordHash = hashPassword(password);
  const newUser = new Users({
    _id: new mongoose.Types.ObjectId(),
    email,
    password: passwordHash,
    cratedDate: new Date(),
  });
  return newUser.save().then(() => newUser.toObject({ getter: true }));
};

const UserService = {
  findUserByEmail,
  createUserByEmailAndPassword,
  findUserByEmailAndPassword,
};
export default UserService;
