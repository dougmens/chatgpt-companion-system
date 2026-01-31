import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { McpStatus } from "./McpStatus";

export function ChatWindow() {
  return (
    <div className="flex h-full flex-col bg-slate-950">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800 px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-100">
            Companion Chat
          </h1>
          <p className="text-xs text-slate-400">
            Minimaler Chat-Stub mit Dashboard-Intent.
          </p>
        </div>
        <McpStatus />
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <MessageList />
      </main>
      <MessageInput />
    </div>
  );
}
