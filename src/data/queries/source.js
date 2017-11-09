import { GraphQLString } from 'graphql';
import SourceVoucherType from '../types/SourceVoucherType';
import { SourceService } from '../service';

const source = {
  type: SourceVoucherType,
  args: {
    id: { type: GraphQLString },
  },
  resolve: async (parent, args, { user }) => {
    const { id } = args;
    const sourceTaget = id
      ? await SourceService.findById(id)
      : await SourceService.findOrCreateDefault(user._id);
    return sourceTaget;
  },
};
export default source;
