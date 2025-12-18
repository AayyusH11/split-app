const simplifyBalances = (balances) => {
  const net = {};

  balances.forEach(({ from, to, amount }) => {
    net[from] = (net[from] || 0) - amount;
    net[to] = (net[to] || 0) + amount;
  });

  const debtors = [];
  const creditors = [];

  Object.entries(net).forEach(([user, amount]) => {
    if (amount < 0) debtors.push({ user, amount: -amount });
    else if (amount > 0) creditors.push({ user, amount });
  });

  const simplified = [];

  let i = 0,
    j = 0;

  while (i < debtors.length && j < creditors.length) {
    const min = Math.min(debtors[i].amount, creditors[j].amount);

    simplified.push({
      from: debtors[i].user,
      to: creditors[j].user,
      amount: min,
    });

    debtors[i].amount -= min;
    creditors[j].amount -= min;

    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }

  return simplified;
};

module.exports = simplifyBalances;
