import { useState, type FormEvent } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: 'assistant',
    content:
      'Hi there! I am your Minesweeper expert. Ask me how numbers work, how to flag mines, or how to solve a tight board. I can help with basic gameplay and strategy.',
  },
];

function getChatbotResponse(message: string) {
  const normalized = message.trim().toLowerCase();

  if (normalized === '/tips') {
    return [
      '1. Start at the edges and corners; they often force easy patterns and help open the board quickly.',
      '2. Use number clues to mark mines before clearing adjacent cells; a safe reveal is always better than a guess.',
      '3. If a cell has the exact number of hidden neighbors as remaining mines, flag them all and move on.',
      '4. When you see a 1 next to an already-flagged cell, the other neighbors are safe to reveal.',
      '5. Keep the board balanced: avoid guessing too early and focus on safe chains of reveals from cleared areas.',
    ].join('\n\n');
  }

  if (normalized === '/strategy') {
    return [
      'Full strategy for finding mines:',
      '1. Open a corner or an edge first to give yourself room to expand. The first click is always safe.',
      '2. Read numbers precisely: each number tells you how many mines touch that cell. Match that number to hidden neighbors.',
      '3. Use flags only when a mine placement is certain. If a number matches all its covered neighbors, mark them as mines.',
      '4. Clear safe cells with deduction: if a number is satisfied by flagged mines, the remaining neighbors are safe.',
      '5. When you cannot deduce with certainty, use probability and board symmetry. In hard situations, look for unique local patterns before guessing.',
      '6. Keep your focus on the open area rather than isolated closed pockets. The biggest breakthroughs come from opening a large safe region.',
      '7. Review the board after each reveal. New numbers often create a chain reaction that tells you the next safe move.',
    ].join('\n\n');
  }

  if (normalized.includes('flag')) {
    return 'Use right-click or long press to place a flag on a suspected mine. Flags help you keep track of cells that should not be revealed.';
  }

  if (normalized.includes('first click') || normalized.includes('safe') || normalized.includes('start')) {
    return 'The first click is always safe. Use it to open a good area and then let the numbers guide your next moves.';
  }

  if (normalized.includes('number') || normalized.includes('adjacent') || normalized.includes('mine count')) {
    return 'Numbers show how many mines are in the 8 surrounding cells. Use them to identify which surrounding hidden cells are safe or should be flagged.';
  }

  if (normalized.includes('guess') || normalized.includes('probability')) {
    return 'Guessing is a last resort. Try to clear all safe cells first and use the smallest uncertain region when you must choose between options.';
  }

  return 'I can help explain Minesweeper basics: numbers, flags, safe reveals, and how to avoid mistakes. Ask me a specific question or describe what you are stuck on.';
}

export function ChatbotBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(1);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput('');

    const reply = getChatbotResponse(trimmed);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    }, 200);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(92vw,380px)] overflow-hidden rounded-[32px] border border-border bg-surface/95 shadow-[0_30px_60px_-20px_rgba(15,23,42,0.3)] backdrop-blur-xl">
          <div className="flex items-center gap-3 border-b border-border px-4 py-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-sky-500 text-white shadow-xl shadow-sky-500/25">
              <div className="absolute inset-2 rounded-full bg-white/10" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <div className="flex h-3.5 w-11 items-center justify-between">
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                </div>
              </div>
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text">Minesweeper Coach</p>
              <p className="truncate text-xs text-text-muted">Ask about flags, numbers, and safe moves.</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-surface text-text transition hover:bg-surface-muted"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>
          <div className="max-h-[56vh] space-y-3 overflow-y-auto px-4 py-4 text-sm">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`group relative rounded-[24px] px-4 py-3 shadow-sm ${
                  message.role === 'assistant'
                    ? 'bg-surface-muted text-text dark:bg-slate-900/90 dark:text-white'
                    : 'self-end bg-accent-blue text-white'
                }`}
              >
                <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-muted">
                  <span className={`inline-flex h-1.5 w-1.5 rounded-full ${message.role === 'assistant' ? 'bg-slate-400 dark:bg-slate-500' : 'bg-white'}`} />
                  <span>{message.role === 'assistant' ? 'Bot' : 'You'}</span>
                </div>
                <p className="whitespace-pre-wrap leading-6">{message.content}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="border-t border-border bg-surface px-4 py-4">
            <div className="flex gap-2">
              <label htmlFor="chatbot-input" className="sr-only">
                Send chat message
              </label>
              <input
                id="chatbot-input"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type a question or try /tips"
                className="w-full rounded-2xl border border-border bg-slate-100 px-3 py-3 text-sm text-text outline-none transition focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 dark:border-white/10 dark:bg-slate-950/90 dark:text-white"
              />
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-accent-blue px-4 text-sm font-semibold text-white transition hover:bg-accent-blue/90"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setUnreadCount(0);
        }}
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-blue text-white shadow-[0_24px_60px_-28px_rgba(26,115,232,0.9)] transition-transform duration-200 hover:-translate-y-0.5"
        aria-label={open ? 'Close Minesweeper coach' : 'Open Minesweeper coach'}
      >
        <span className="absolute inset-0 rounded-full bg-accent-blue/20 blur-xl" />
        <span className="absolute inset-0 rounded-full border border-white/20" />
        <span className="absolute -inset-2 rounded-full border border-accent-blue/40 opacity-40 animate-ping" />
        <span className="absolute -inset-5 rounded-full border border-accent-blue/30 opacity-20 animate-pulse" />
        <MessageCircle size={24} />
        {unreadCount > 0 && (
          <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[0.65rem] font-semibold text-white shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
}
