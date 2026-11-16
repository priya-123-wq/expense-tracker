import { useState, useEffect } from 'react';

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expense_tracker');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Freelance Project', amount: 5000, type: 'income' },
      { id: 2, text: 'Internet Recharge', amount: -300, type: 'expense' }
    ];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  useEffect(() => {
    localStorage.setItem('expense_tracker', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (e) => {
    e.preventDefault();
    if (!text || !amount) return;
    const numAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));
    setTransactions([{ id: Date.now(), text, amount: numAmount, type }, ...transactions]);
    setText('');
    setAmount('');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalBalance = transactions.reduce((acc, item) => acc + item.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, item) => acc + item.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((acc, item) => acc + Math.abs(item.amount), 0);
   
  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif', background: '#f8fafc', borderRadius: '10px', color: '#1e293b' }}>
      <h1 style={{ textAlign: 'center' }}>Expense Tracker</h1>

      <div style={{ background: '#1e293b', color: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center', marginBottom: '15px' }}>
        <small>YOUR BALANCE</small>
        <h2 style={{ margin: '5px 0', fontSize: '28px' }}>Rs. {totalBalance}</h2>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-around', background: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ color: '#16a34a', textAlign: 'center' }}>
          <strong>INCOME</strong>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>+Rs. {income}</div>
        </div>
        <div style={{ color: '#ef4444', textAlign: 'center' }}>
          <strong>EXPENSE</strong>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>-Rs. {expense}</div>
        </div>
      </div>

      <form onSubmit={addTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="Description (e.g. Food, Salary)" value={text} onChange={(e) => setText(e.target.value)} style={{ padding: '10px' }} required />
        <input type="number" placeholder="Amount (Rs)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ padding: '10px' }} required />
        <select value={type} onChange={(e) => setType(e.target.value)} style={{ padding: '10px' }}>
          <option value="expense">Expense (-)</option>
          <option value="income">Income (+)</option>
        </select>
        <button type="submit" style={{ padding: '10px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          + Add Transaction
        </button>
      </form>

      <div>
        <h3>History</h3>
        {transactions.map(tx => (
          <div key={tx.id} style={{ background: '#fff', padding: '12px', marginBottom: '8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRight: tx.amount > 0 ? '5px solid #16a34a' : '5px solid #ef4444' }}>
            <span>{tx.text}</span>
            <div>
              <strong style={{ marginRight: '10px', color: tx.amount > 0 ? '#16a34a' : '#ef4444' }}>
                {tx.amount > 0 ? '+Rs. ' + tx.amount : '-Rs. ' + Math.abs(tx.amount)}
              </strong>
              <button onClick={() => deleteTransaction(tx.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>X</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
