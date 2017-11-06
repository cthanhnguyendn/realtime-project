import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import ExpenseCategoryType from './ExpenseCategoryType';
import ReceiveCategoryType from './ReceiveCategoryType';
import DateType from './DateType';

const voucherType = new ObjectType({
  name: 'Voucher',
  fields: {
    id: { type: ID },
    title: { type: GraphQLString },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    applyDate: { type: DateType },
    createdate: { type: DateType },
    modifiedDate: { type: DateType },
    expenseCategory: { type: ExpenseCategoryType },
    receiveCategory: { type: ReceiveCategoryType },
  },
});
export default voucherType;
