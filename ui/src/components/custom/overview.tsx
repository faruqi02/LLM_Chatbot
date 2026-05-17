import { motion } from 'framer-motion';
import { MessageCircle, BotIcon, Database, Cpu, Server, Monitor } from 'lucide-react';

export const Overview = () => {
  return (
    <>
      <motion.div
        key="overview"
        className="max-w-3xl mx-auto md:mt-20"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ delay: 0.75 }}
      >
        <div className="rounded-xl p-6 flex flex-col gap-6 leading-relaxed text-center max-w-xl mx-auto">
          <p className="flex flex-row justify-center gap-4 items-center text-primary">
            <BotIcon size={44} />
            <span className="text-2xl text-muted-foreground">+</span>
            <MessageCircle size={44} />
          </p>
          
          <div className="flex flex-col gap-1 mb-2">
            <p className="text-lg">
              Welcome to <strong>LLM AI Agent for SQL DB Query from SQLite</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              made by <strong>Ismail Faruqi Faisol</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-left">
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/50 shadow-sm transition-colors hover:bg-muted/60">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Database</span>
                <span className="font-semibold">mfg_ops.db</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/50 shadow-sm transition-colors hover:bg-muted/60">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Cpu className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">LLM</span>
                <span className="font-semibold">llama3.2:3b</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/50 shadow-sm transition-colors hover:bg-muted/60">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Server className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Backend</span>
                <span className="font-semibold">FastAPI</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/50 shadow-sm transition-colors hover:bg-muted/60">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Monitor className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider font-semibold">Frontend</span>
                <span className="font-semibold">React (Vite)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
