const gifts = [
  { id: 'G-101', name: 'Castle', price: '100,000', category: 'Premium', sentToday: 842, revenue: '$42,100' },
  { id: 'G-102', name: 'Rocket', price: '50,000', category: 'Premium', sentToday: 1205, revenue: '$60,250' },
  { id: 'G-103', name: 'Rose', price: '100', category: 'Standard', sentToday: 48200, revenue: '$4,820' },
  { id: 'G-104', name: 'Diamond Ring', price: '25,000', category: 'Luxury', sentToday: 320, revenue: '$8,000' },
  { id: 'G-105', name: 'Heart', price: '50', category: 'Standard', sentToday: 91000, revenue: '$4,550' },
];

export default function GiftsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gifts</h1>
          <p className="text-[var(--text-secondary)] mt-1">Virtual gift catalog and transaction overview</p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium transition-colors">
          Add Gift
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-amber-400">$12.4M</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Gift GMV (MTD)</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold">141,567</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Gifts Sent Today</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-2xl font-bold text-purple-400">48</p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Active Gift Types</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-[var(--text-secondary)]">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Price (coins)</th>
              <th className="text-left p-4 font-medium">Category</th>
              <th className="text-left p-4 font-medium">Sent Today</th>
              <th className="text-left p-4 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map((gift) => (
              <tr key={gift.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-[var(--text-secondary)]">{gift.id}</td>
                <td className="p-4 font-medium">{gift.name}</td>
                <td className="p-4">{gift.price}</td>
                <td className="p-4 text-[var(--text-secondary)]">{gift.category}</td>
                <td className="p-4">{gift.sentToday.toLocaleString()}</td>
                <td className="p-4 text-emerald-400">{gift.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
