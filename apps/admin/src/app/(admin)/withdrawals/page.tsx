const withdrawals = [
  { id: 'W-3301', user: '@starhost', amount: '$2,400', method: 'Bank Transfer', status: 'Pending', requested: '2 min ago' },
  { id: 'W-3300', user: '@mika88', amount: '$8,500', method: 'PayPal', status: 'Pending', requested: '1h ago' },
  { id: 'W-3299', user: '@luna_live', amount: '$1,200', method: 'Bank Transfer', status: 'Approved', requested: '3h ago' },
  { id: 'W-3298', user: '@djnova', amount: '$450', method: 'Crypto', status: 'Rejected', requested: '5h ago' },
  { id: 'W-3297', user: '@echo_room', amount: '$3,100', method: 'Bank Transfer', status: 'Processing', requested: '6h ago' },
];

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-500/20 text-amber-400',
  Approved: 'bg-emerald-500/20 text-emerald-400',
  Rejected: 'bg-rose-500/20 text-rose-400',
  Processing: 'bg-cyan-500/20 text-cyan-400',
};

export default function WithdrawalsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Withdrawals</h1>
        <p className="text-[var(--text-secondary)] mt-1">Review and process creator payout requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-amber-400">23</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Pending</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-cyan-400">8</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Processing</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-emerald-400">$124,800</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Paid This Week</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-rose-400">3</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Rejected</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[var(--text-secondary)]">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Amount</th>
              <th className="text-left p-4 font-medium">Method</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Requested</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-[var(--text-secondary)]">{w.id}</td>
                <td className="p-4 font-medium">{w.user}</td>
                <td className="p-4">{w.amount}</td>
                <td className="p-4 text-[var(--text-secondary)]">{w.method}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[w.status]}`}>
                    {w.status}
                  </span>
                </td>
                <td className="p-4 text-[var(--text-secondary)]">{w.requested}</td>
                <td className="p-4">
                  {w.status === 'Pending' && (
                    <div className="flex gap-2">
                      <button className="text-xs px-2 py-1 rounded bg-emerald-600/30 text-emerald-400 hover:bg-emerald-600/50">
                        Approve
                      </button>
                      <button className="text-xs px-2 py-1 rounded bg-rose-600/30 text-rose-400 hover:bg-rose-600/50">
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
