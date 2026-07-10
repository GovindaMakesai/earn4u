const users = [
  { id: 'U-10482', username: '@starhost', email: 'star@example.com', vip: 'VIP 12', status: 'Active', joined: '2024-03-12' },
  { id: 'U-10481', username: '@luna_live', email: 'luna@example.com', vip: 'VIP 8', status: 'Active', joined: '2024-05-01' },
  { id: 'U-10480', username: '@djnova', email: 'nova@example.com', vip: 'VIP 5', status: 'Suspended', joined: '2024-01-20' },
  { id: 'U-10479', username: '@mika88', email: 'mika@example.com', vip: 'VIP 15', status: 'Active', joined: '2023-11-08' },
  { id: 'U-10478', username: '@echo_room', email: 'echo@example.com', vip: 'VIP 3', status: 'Pending', joined: '2025-02-14' },
];

const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-500/20 text-emerald-400',
  Suspended: 'bg-rose-500/20 text-rose-400',
  Pending: 'bg-amber-500/20 text-amber-400',
};

export default function UsersPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-[var(--text-secondary)] mt-1">Manage platform users and creators</p>
        </div>
        <input
          type="search"
          placeholder="Search users..."
          className="px-4 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 text-sm w-64 focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[var(--text-secondary)]">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">Username</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">VIP</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-[var(--text-secondary)]">{user.id}</td>
                <td className="p-4 font-medium">{user.username}</td>
                <td className="p-4 text-[var(--text-secondary)]">{user.email}</td>
                <td className="p-4">{user.vip}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-[var(--text-secondary)]">{user.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
