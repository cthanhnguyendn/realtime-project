import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import DateType from './DateType';

const expenseCategoryType = new ObjectType({
  name: 'ExpenseCategory',
  fields: {
    id: { type: ID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    totalVoucher: { type: GraphQLInt },
    totalAmount: { type: GraphQLInt },
    createdDate: { type: DateType },
    modifiedDate: { type: DateType },
  },
});

export default expenseCategoryType;
