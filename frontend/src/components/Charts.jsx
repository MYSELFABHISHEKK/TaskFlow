import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const colors = ['#0f766e', '#0369a1', '#111827', '#be123c'];

export default function Charts({ byStatus = [], perUser = [] }) {
  return (
    <div className="grid gap-4 xl:grid-cols-5">
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 xl:col-span-3">
        <h3 className="font-semibold">Tasks per user</h3>
        <div className="mt-5 h-72">
          <ResponsiveContainer>
            <BarChart data={perUser}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 xl:col-span-2">
        <h3 className="font-semibold">Status mix</h3>
        <div className="mt-5 h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={byStatus} innerRadius={58} outerRadius={92} paddingAngle={5} dataKey="value">
                {byStatus.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
