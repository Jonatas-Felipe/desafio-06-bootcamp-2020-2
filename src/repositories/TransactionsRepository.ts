import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const balance = transactions.reduce(
      (sum, transaction) => {
        const balanced = sum;
        if (transaction.type === 'income') {
          balanced.income += transaction.value;
          balanced.total += transaction.value;
        } else {
          balanced.outcome += transaction.value;
          balanced.total -= transaction.value;
        }

        return balanced;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    return balance;
  }
}

export default TransactionsRepository;
