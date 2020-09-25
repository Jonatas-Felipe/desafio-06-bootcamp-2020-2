import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transacition = await transactionsRepository.findOne(id);

    if (!transacition) {
      throw new AppError('Transacition not found');
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
