'use client';

import { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Calendar,
  UtensilsCrossed,
  Building2,
  HelpCircle,
} from 'lucide-react';

const TOPICS = [
  { id: 'booking', label: 'Booking', icon: Calendar },
  { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
  { id: 'corporate', label: 'Corporate', icon: Building2 },
  { id: 'general', label: 'General Inquiry', icon: HelpCircle },
];

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    // UI only — live chat API integration pending
  };

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-tunga-lg md:bottom-28 md:right-8"
          role="dialog"
          aria-label="Live chat"
        >
          <div className="flex items-center justify-between bg-tunga-navy px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">Live Chat</p>
              <p className="text-xs text-white/70">Support · Booking · Restaurant</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 hover:bg-white/10"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-1 border-b border-slate-100 p-2">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTopic(t.id)}
                  className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[10px] font-medium transition ${
                    topic === t.id
                      ? 'bg-tunga-gold/15 text-tunga-navy'
                      : 'text-muted-foreground hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className="flex-1 p-4">
            {sent ? (
              <p className="text-center text-sm text-muted-foreground" role="status">
                Message sent. Our team will respond shortly.
              </p>
            ) : (
              <form onSubmit={handleSend} className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  rows={4}
                  required
                  className="w-full resize-none rounded-tunga border border-slate-200 px-3 py-2 text-sm outline-none focus:border-tunga-gold focus:ring-1 focus:ring-tunga-gold"
                  aria-label="Chat message"
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-tunga bg-tunga-navy py-2.5 text-sm font-semibold text-white transition hover:bg-tunga-gold hover:text-tunga-navy"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-tunga-navy text-white shadow-tunga-lg transition hover:bg-tunga-gold hover:text-tunga-navy md:bottom-28 md:right-8"
        aria-label={open ? 'Close live chat' : 'Open live chat'}
        aria-expanded={open}
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    </>
  );
}
