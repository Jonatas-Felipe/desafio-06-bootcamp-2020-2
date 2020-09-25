import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

// import AppError from '../errors/AppError';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Response {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const csvFilePath = path.resolve(__dirname, '..', '..', 'tmp', filename);
    const readCSVStream = fs.createReadStream(csvFilePath);
    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });
    const parseCSV = readCSVStream.pipe(parseStream);
    const createTransaction = new CreateTransactionService();

    const transactionsOfFile: Response[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line as [
        string,
        'income' | 'outcome',
        number,
        string,
      ];

      transactionsOfFile.push({
        title,
        type,
        value,
        category,
      });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const transactions = [];

    for (const transaction of transactionsOfFile) {
      const response = await createTransaction.execute(transaction);
      transactions.push(response);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
