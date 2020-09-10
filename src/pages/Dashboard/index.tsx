import React, { useState, useEffect } from 'react';
// Numeral is a jS library
// import numeral from 'numeral';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface TransactionRequest {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    // async function loadTransactions(): Promise<void> {
    //   const balanceData = await api.get('transactions');
    //   console.log(balanceData.data);
    // }

    api.get('transactions').then(res => {
      const {
        income: incomeData,
        outcome: outcomeData,
        total: totalData,
      } = res.data.balance;

      const formatedBalance = {
        income: `R$ ${formatValue(incomeData)},00`,
        outcome: `R$ ${formatValue(outcomeData)},00`,
        total: `R$ ${formatValue(totalData)},00`,
      };

      setBalance(formatedBalance);

      const transactionsData: TransactionRequest[] = res.data.transactions;
      const formatedTransactions: Transaction[] = [];

      transactionsData.forEach((data): void => {
        const d = new Date(data.created_at);
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
        const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(
          d,
        );
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

        const currencySign = data.type === 'outcome' ? '- ' : '';

        formatedTransactions.push({
          ...data,
          formattedDate: `${da}/${mo}/${ye}`,
          formattedValue: `${currencySign} ${formatValue(data.value)}`,
        });
      });

      setTransactions(formatedTransactions);
    });

    // loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.value}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
