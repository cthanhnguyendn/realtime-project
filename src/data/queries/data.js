import { GraphQLList, GraphQLObjectType } from 'graphql';
import SourceVoucherType from '../types/SourceVoucherType';
import source from './source';
import Exception from '../exception';
import { SourceService } from '../service';

const data = {
  type: new GraphQLObjectType({
    name: 'Data',
    fields: {
      source,
      listSource: { type: new GraphQLList(SourceVoucherType) },
    },
  }),
  resolve(parent, args, { user }) {
    if (!user) throw Exception.permissionError();
    const { _id } = user;
    return SourceService.getUserSourceVoucher(_id).then(listSource => ({
      listSource,
    }));
  },
};
export default data;
