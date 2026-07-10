const reports = [
  { id: 'M-901', type: 'Content', target: '@djnova stream', reporter: '@user_4421', reason: 'Inappropriate content', status: 'Open', filed: '5 min ago' },
  { id: 'M-900', type: 'User', target: '@spam_bot99', reporter: '@luna_live', reason: 'Spam / harassment', status: 'Open', filed: '12 min ago' },
  { id: 'M-899', type: 'Room', target: 'Midnight Lounge', reporter: '@mika88', reason: 'Hate speech', status: 'Reviewing', filed: '30 min ago' },
  { id: 'M-898', type: 'Content', target: '@echo_room stream', reporter: '@starhost', reason: 'Copyright violation', status: 'Resolved', filed: '2h ago' },
  { id: 'M-897', type: 'User', target: '@fake_vip', reporter: 'System', reason: 'Fraudulent activity', status: 'Action Taken', filed: '4h ago' },
];

const statusStyles: Record<string, string> = {
  Open: 'bg-rose-500/20 text-rose-400',
  Reviewing: 'bg-amber-500/20 text-amber-400',
  Resolved: 'bg-emerald-500/20 text-emerald-400',
  'Action Taken': 'bg-purple-500/20 text-purple-400',
};

export default function ModerationPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Moderation</h1>
        <p className="text-[var(--text-secondary)] mt-1">Review reports and enforce platform policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-rose-400">7</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Open Reports</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-amber-400">4</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Under Review</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold">142</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Resolved Today</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-purple-400">18</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Accounts Suspended</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[var(--text-secondary)]">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">Type</th>
              <th className="text-left p-4 font-medium">Target</th>
              <th className="text-left p-4 font-medium">Reporter</th>
              <th className="text-left p-4 font-medium">Reason</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Filed</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-[var(--text-secondary)]">{report.id}</td>
                <td className="p-4">{report.type}</td>
                <td className="p-4 font-medium">{report.target}</td>
                <td className="p-4 text-[var(--text-secondary)]">{report.reporter}</td>
                <td className="p-4">{report.reason}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[report.status]}`}>
                    {report.status}
                  </span>
                </td>
                <td className="p-4 text-[var(--text-secondary)]">{report.filed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
