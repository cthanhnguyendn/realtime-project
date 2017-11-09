import { GraphQLList } from 'graphql';
import { ExpenseCategoryType } from '../types/index';
import { ECatService } from '../service';

const expenseCategory = {
  type: new GraphQLList(ExpenseCategoryType),
  resolve(source) {
    const sourceId = source.id;
    // console.log( "this source id" + sourceId)
    return ECatService.getAllExpenseCategoryAndVoucherAggragate(sourceId);
  },
};
export default expenseCategory;
