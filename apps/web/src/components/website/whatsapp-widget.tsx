'use client';

import { useState } from 'react';
import { MessageCircle, X, UtensilsCrossed, Calendar, HeadphonesIcon } from 'lucide-react';

interface WhatsAppWidgetProps {
  phone: string;
}

const QUICK_ACTIONS = [
  { label: 'Quick Inquiry', message: 'Hello, I have a general inquiry.', icon: MessageCircle },
  { label: 'Book a Room', message: 'Hello, I would like to book a room.', icon: Calendar },
  { label: 'Restaurant', message: 'Hello, I would like to reserve a table.', icon: UtensilsCrossed },
  { label: 'Support', message: 'Hello, I need assistance.', icon: HeadphonesIcon },
];

export function WhatsAppWidget({ phone }: WhatsAppWidgetProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
      {open && (
        <div className="mb-3 w-64 overflow-hidden rounded-2xl border border-white/20 bg-white shadow-tunga-lg">
          <div className="bg-[#25D366] px-4 py-3 text-white">
            <p className="text-sm font-semibold">WhatsApp Us</p>
            <p className="text-xs text-white/80">We typically reply within minutes</p>
          </div>
          <ul className="p-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <li key={action.label}>
                  <a
                    href={`https://wa.me/${phone}?text=${encodeURIComponent(action.message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-tunga-navy transition hover:bg-slate-50"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4 text-[#25D366]" />
                    {action.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
        }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-tunga-lg transition hover:scale-105"
        aria-label={open ? 'Close WhatsApp menu' : 'Open WhatsApp menu'}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
