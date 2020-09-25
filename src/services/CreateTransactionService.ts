import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);

    let categorySelected = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categorySelected) {
      categorySelected = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categorySelected);
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const { total } = await transactionsRepository.getBalance();

    if (total < value && type === 'outcome') {
      throw new AppError(
        'The user does not have the necessary amount in cash to proceed with this transaction.',
      );
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categorySelected.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
