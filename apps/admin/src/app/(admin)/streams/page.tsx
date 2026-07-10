const streams = [
  { id: 'S-8821', host: '@starhost', title: 'Late Night Vibes', viewers: 12400, category: 'Music', status: 'Live', started: '2h ago' },
  { id: 'S-8820', host: '@luna_live', title: 'PK Battle Finals', viewers: 8900, category: 'Battle', status: 'Live', started: '45m ago' },
  { id: 'S-8819', host: '@djnova', title: 'Chill Beats Session', viewers: 3200, category: 'Music', status: 'Live', started: '1h ago' },
  { id: 'S-8818', host: '@mika88', title: 'Q&A with Fans', viewers: 0, category: 'Talk', status: 'Ended', started: '5h ago' },
  { id: 'S-8817', host: '@echo_room', title: 'New Creator Debut', viewers: 560, category: 'Lifestyle', status: 'Live', started: '20m ago' },
];

const statusStyles: Record<string, string> = {
  Live: 'bg-rose-500/20 text-rose-400',
  Ended: 'bg-white/10 text-[var(--text-secondary)]',
};

export default function StreamsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Streams</h1>
        <p className="text-[var(--text-secondary)] mt-1">Monitor live streams and broadcast activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-rose-400">342</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Live Now</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold">48,291</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Total Viewers</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-purple-400">1,204</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Streams Today</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[var(--text-secondary)]">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">Host</th>
              <th className="text-left p-4 font-medium">Title</th>
              <th className="text-left p-4 font-medium">Viewers</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Started</th>
            </tr>
          </thead>
          <tbody>
            {streams.map((stream) => (
              <tr key={stream.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-[var(--text-secondary)]">{stream.id}</td>
                <td className="p-4 font-medium">{stream.host}</td>
                <td className="p-4">{stream.title}</td>
                <td className="p-4">{stream.viewers.toLocaleString()}</td>
                <td className="p-4 text-[var(--text-secondary)]">{stream.category}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[stream.status]}`}>
                    {stream.status}
                  </span>
                </td>
                <td className="p-4 text-[var(--text-secondary)]">{stream.started}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
