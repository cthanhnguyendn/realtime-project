import {
  GraphQLObjectType as ObjectType,
  GraphQLID,
  GraphQLString,
} from 'graphql';
import expenseCategoryQuery from '../queries/expenseCategory';
import receiveCategoryQuery from '../queries/receiveCategory';
import voucherQuery from '../queries/voucher';
import DateType from './DateType';

const sourceVoucherType = new ObjectType({
  name: 'SourceVoucher',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    expenseCategorys: expenseCategoryQuery,
    receiveCategorys: receiveCategoryQuery,
    listVoucher: voucherQuery,
    createdate: { type: DateType },
    modifiedDate: { type: DateType },
  },
});
export default sourceVoucherType;
