import { useCompanionStore } from "../state/companionStore";

export function MessageList() {
  const messages = useCompanionStore((state) => state.messages);

  if (messages.length === 0) {
    return (
      <div className="text-sm text-slate-400">
        Noch keine Nachrichten. Schreibe z. B. "zeige mir das Dashboard Recht".
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => {
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={`max-w-[75%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
              isUser
                ? "self-end bg-blue-600 text-white"
                : "self-start bg-slate-800 text-slate-100"
            }`}
          >
            {message.content}
          </div>
        );
      })}
    </div>
  );
}
