const rooms = [
  { id: 'R-4412', host: '@echo_room', name: 'Midnight Lounge', seats: '8/12', listeners: 340, theme: 'Neon', status: 'Active' },
  { id: 'R-4411', host: '@luna_live', name: 'Fan Club Hangout', seats: '12/12', listeners: 890, theme: 'Gold', status: 'Full' },
  { id: 'R-4410', host: '@djnova', name: 'Beat Makers', seats: '5/8', listeners: 120, theme: 'Dark', status: 'Active' },
  { id: 'R-4409', host: '@mika88', name: 'VIP Only Room', seats: '3/6', listeners: 45, theme: 'Royal', status: 'Active' },
  { id: 'R-4408', host: '@starhost', name: 'After Party', seats: '0/10', listeners: 0, theme: 'Party', status: 'Empty' },
];

const statusStyles: Record<string, string> = {
  Active: 'bg-cyan-500/20 text-cyan-400',
  Full: 'bg-amber-500/20 text-amber-400',
  Empty: 'bg-white/10 text-[var(--text-secondary)]',
};

export default function RoomsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Voice Rooms</h1>
        <p className="text-[var(--text-secondary)] mt-1">Manage voice party rooms and moderation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-cyan-400">1,205</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Active Rooms</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold">18,420</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Total Listeners</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-amber-400">86</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Full Rooms</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[var(--text-secondary)]">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">Host</th>
              <th className="text-left p-4 font-medium">Room Name</th>
              <th className="text-left p-4 font-medium">Seats</th>
              <th className="text-left p-4 font-medium">Listeners</th>
              <th className="text-left p-4 font-medium">Theme</th>
              <th className="text-left p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-[var(--text-secondary)]">{room.id}</td>
                <td className="p-4 font-medium">{room.host}</td>
                <td className="p-4">{room.name}</td>
                <td className="p-4">{room.seats}</td>
                <td className="p-4">{room.listeners}</td>
                <td className="p-4 text-[var(--text-secondary)]">{room.theme}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[room.status]}`}>
                    {room.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
