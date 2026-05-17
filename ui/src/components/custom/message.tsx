import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cx } from 'classix';
import { SparklesIcon } from './icons';
import { Markdown } from './markdown';
import { message } from "../../interfaces/interfaces"
import { MessageActions } from '@/components/custom/actions';
import { DataTable } from './DataTable';
import { DynamicChart } from './DynamicChart';
import { Button } from '../ui/button';
import { BarChart, Table } from 'lucide-react';

export const PreviewMessage = ({ message }: { message: message; }) => {
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const userPrompt = message.data?.userPrompt?.toLowerCase() || '';
  const requestedChart = userPrompt.includes('chart') || userPrompt.includes('graph') || userPrompt.includes('plot');
  const canChart = requestedChart && message.data && message.data.ok && !message.data.conversational && message.data.columns && message.data.columns.length >= 2;

  useEffect(() => {
    if (canChart) {
      setViewMode('chart');
    } else {
      setViewMode('table');
    }
  }, [canChart]);
  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      data-role={message.role}
    >
      <div
        className={cx(
          'group-data-[role=user]/message:bg-zinc-700 dark:group-data-[role=user]/message:bg-muted group-data-[role=user]/message:text-white flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl'
        )}
      >
        {message.role === 'assistant' && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
            <SparklesIcon size={14} />
          </div>
        )}

        <div className="flex flex-col w-full">
          {message.content && (
            <div className="flex flex-col gap-4 text-left">
              <Markdown>{message.content}</Markdown>
            </div>
          )}

          {message.data && message.data.ok && !message.data.conversational && (
            <div className="mt-4 flex flex-col gap-2">
              {canChart && (
                <div className="flex gap-1 bg-muted/50 p-1 w-fit rounded-lg border border-border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cx("h-8 px-3 gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100", viewMode === 'table' ? "bg-background shadow-sm text-zinc-900 dark:text-zinc-100" : "")}
                    onClick={() => setViewMode('table')}
                  >
                    <Table size={16} /> Table
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={cx("h-8 px-3 gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100", viewMode === 'chart' ? "bg-background shadow-sm text-zinc-900 dark:text-zinc-100" : "")}
                    onClick={() => setViewMode('chart')}
                  >
                    <BarChart size={16} /> Chart
                  </Button>
                </div>
              )}
              
              <AnimatePresence mode="wait">
                {viewMode === 'table' ? (
                  <motion.div key="table" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <DataTable data={message.data} />
                  </motion.div>
                ) : (
                  <motion.div key="chart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <DynamicChart data={message.data} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {message.role === 'assistant' && (
            <MessageActions message={message} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ThinkingMessage = () => {
  const role = 'assistant';

  return (
    <motion.div
      className="w-full mx-auto max-w-3xl px-4 group/message "
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      data-role={role}
    >
      <div
        className={cx(
          'flex gap-4 group-data-[role=user]/message:px-3 w-full group-data-[role=user]/message:w-fit group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:py-2 rounded-xl',
          'group-data-[role=user]/message:bg-muted'
        )}
      >
        <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border">
          <SparklesIcon size={14} />
        </div>
      </div>
    </motion.div>
  );
};
