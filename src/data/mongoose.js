import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost/test', {
  useMongoClient: true,
});
mongoose.Promise = global.Promise;

export default mongoose;
