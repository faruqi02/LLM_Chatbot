import { MessageData } from "../../interfaces/interfaces";
import { motion } from "framer-motion";

export const DataTable = ({ data }: { data: MessageData }) => {
    if (!data.ok || !data.columns || !data.rows) return null;
    
    if (data.rows.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 p-4 bg-muted/30 rounded-lg"
            >
                No results found.
            </motion.div>
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-100 dark:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300">
                        <tr>
                            {data.columns.map((col, idx) => (
                                <th key={idx} className="px-4 py-3 font-semibold border-b border-border whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                {data.columns!.map((col, cIdx) => (
                                    <td key={cIdx} className="px-4 py-3 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                                        {row[col] !== null ? String(row[col]) : <span className="text-zinc-400 italic">null</span>}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 text-xs text-zinc-500 border-t border-border flex justify-between">
                <span>Showing {data.row_count} row(s)</span>
            </div>
        </motion.div>
    );
};
