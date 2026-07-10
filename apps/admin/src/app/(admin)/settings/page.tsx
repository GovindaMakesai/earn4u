export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">Platform configuration and admin preferences</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Platform Name</label>
              <input
                type="text"
                defaultValue="Earn4U"
                className="w-full px-4 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Support Email</label>
              <input
                type="email"
                defaultValue="support@earn4u.com"
                className="w-full px-4 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Economy</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Coin to USD Rate</label>
              <input
                type="text"
                defaultValue="100 coins = $1.00"
                className="w-full px-4 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Minimum Withdrawal</label>
              <input
                type="text"
                defaultValue="$50.00"
                className="w-full px-4 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-1">Creator Revenue Share</label>
              <input
                type="text"
                defaultValue="50%"
                className="w-full px-4 py-2 rounded-lg bg-[var(--primary-700)] border border-white/10 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </section>

        <section className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-4">Moderation</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm">Auto-flag suspicious withdrawals</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-500" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Require ID verification for creators</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-purple-500" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm">Enable AI content screening</span>
              <input type="checkbox" className="w-4 h-4 accent-purple-500" />
            </label>
          </div>
        </section>

        <button className="px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
