import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLObjectType,
} from 'graphql';
import VoucherType from '../types/VoucherType';
import { RCatService, ECatService, VoucherService } from '../service';
import { publishAddVoucher } from '../subscriptions/voucherSubscription';

export const addVoucher = {
  type: VoucherType,
  args: {
    title: { type: GraphQLString },
    amount: { type: new GraphQLNonNull(GraphQLInt) },
    expenseCategoryId: { type: GraphQLInt },
    receiveCategoryId: { type: GraphQLInt },
    expenseCategoryName: { type: GraphQLString },
    receiveCategoryName: { type: GraphQLString },
  },
  resolve(parentValue, args) {
    const { user } = parentValue;
    const { expenseCategoryName, title, amount, receiveCategoryName } = args;
    if (expenseCategoryName) {
      return ECatService.findOrCreateNewExpenseCategory({
        expenseCategoryName,
      }).then(category =>
        VoucherService.createNewVoucher({
          title,
          amount,
          expenseCategoryId: category._id,
        }).then(voucher => {
          publishAddVoucher({ voucher });
          return voucher;
        }),
      );
    }
    if (receiveCategoryName) {
      return RCatService.findOrCreateNewReceiveCategoryName({
        receiveCategoryName,
      }).then(category =>
        VoucherService.createNewVoucher({
          title,
          amount,
          receiveCategoryId: category._id,
        }),
      );
    }
    return VoucherService.createNewVoucher({ title, amount }).then(voucher => {
      publishAddVoucher({ voucher });
      return voucher;
    });
  },
};
export const deleteVoucher = {
  type: VoucherType,
  args: {
    id: { type: GraphQLString },
  },
  resolve(parentValue, args) {
    const { id } = args;
    return VoucherService.deleteVoucher(id);
  },
};

const VoucherMutationType = new GraphQLObjectType({
  name: 'voucherMutation',
  fields: {
    addVoucher,
    deleteVoucher,
  },
});

const voucherMutation = {
  type: VoucherMutationType,
  resolve({ request }) {
    const { user } = request;
    return {};
  },
};

export default voucherMutation;
