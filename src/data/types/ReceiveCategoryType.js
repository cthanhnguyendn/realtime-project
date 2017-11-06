import {
  GraphQLObjectType as ObjectType,
  GraphQLID as ID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
} from 'graphql';
import DateType from './DateType';

const receiveCategoryType = new ObjectType({
  name: 'ReceiveCategory',
  fields: {
    id: { type: ID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    totalVoucher: { type: GraphQLInt },
    totalAmount: { type: GraphQLInt },
    createdDate: { type: DateType },
    modifiedDate: { type: DateType },
  },
});

export default receiveCategoryType;
