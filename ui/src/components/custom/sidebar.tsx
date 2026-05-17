import { ChatSession } from "../../interfaces/interfaces";
import { Button } from "../ui/button";
import { Plus, MessageSquare, PanelLeftClose, PanelLeftOpen, Trash2 } from "lucide-react";
import { cx } from "classix";

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ sessions, currentSessionId, onSelectSession, onNewChat, onDeleteSession, isCollapsed, setIsCollapsed }: SidebarProps) {
  if (isCollapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 border-r border-border bg-zinc-50 dark:bg-zinc-900 w-[60px] shrink-0 transition-all duration-300">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="mb-4">
          <PanelLeftOpen size={20} className="text-zinc-600 dark:text-zinc-400" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onNewChat} className="mb-4 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700">
          <Plus size={20} />
        </Button>
      </div>
    );
  }

  // Sort sessions by updatedAt descending
  const sortedSessions = [...sessions].sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="h-full flex flex-col py-4 border-r border-border bg-zinc-50 dark:bg-zinc-900 w-[260px] shrink-0 transition-all duration-300">
      <div className="flex items-center justify-between px-3 mb-6">
        <Button onClick={onNewChat} className="flex-1 justify-start gap-2 mr-2 h-10 bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
          <Plus size={18} /> New Chat
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)} className="shrink-0 h-10 w-10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800">
          <PanelLeftClose size={20} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 flex flex-col gap-1">
        {sortedSessions.length === 0 && (
          <div className="text-center text-sm text-zinc-500 mt-4">No history yet</div>
        )}
        {sortedSessions.map(session => (
          <div key={session.id} className="relative group flex items-center">
            <Button
              variant="ghost"
              className={cx(
                "w-full justify-start gap-3 px-3 py-3 h-auto text-left font-normal rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors",
                currentSessionId === session.id ? "bg-zinc-200 dark:bg-zinc-800 font-medium" : "text-zinc-600 dark:text-zinc-400"
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <MessageSquare size={16} className={cx("shrink-0", currentSessionId === session.id ? "text-blue-500" : "text-zinc-400")} />
              <span className="line-clamp-1 pr-10">{session.title}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-zinc-500 hover:text-red-600 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-red-400 shadow-sm border border-zinc-300 dark:border-zinc-700 z-10"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
