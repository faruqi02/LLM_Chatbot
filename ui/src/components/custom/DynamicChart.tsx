import { MessageData } from "../../interfaces/interfaces";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export function DynamicChart({ data }: { data: MessageData }) {
    if (!data.ok || !data.columns || !data.rows || data.rows.length === 0) return null;

    const columns = data.columns;
    if (columns.length < 2) {
        return <div className="text-sm text-zinc-500 mt-4 p-4 bg-muted/30 rounded-lg">Not enough columns to chart. Expected at least 2.</div>;
    }

    const xAxisKey = columns[0];
    const yAxisKey = columns[1];

    const isDate = xAxisKey.toLowerCase().includes('date') || xAxisKey.toLowerCase().includes('time') || xAxisKey.toLowerCase().includes('ts');

    return (
        <div className="w-full h-[350px] mt-4 p-4 rounded-xl border border-border bg-card shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                {isDate ? (
                    <LineChart data={data.rows} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#525252" opacity={0.2} vertical={false} />
                        <XAxis dataKey={xAxisKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line type="monotone" dataKey={yAxisKey} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                    </LineChart>
                ) : (
                    <BarChart data={data.rows} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#525252" opacity={0.2} vertical={false} />
                        <XAxis dataKey={xAxisKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#525252', opacity: 0.1 }}
                        />
                        <Bar dataKey={yAxisKey} fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                    </BarChart>
                )}
            </ResponsiveContainer>
        </div>
    );
}
