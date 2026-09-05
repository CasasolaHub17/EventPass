// src/context/TicketContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type TicketStatus = 'upcoming' | 'ongoing' | 'finished' | 'cancelled';

export interface Ticket {
  id: string;
  eventId?: string;
  title: string;
  date: string;
  attendeeName?: string;
  email?: string;
  phone?: string;
  isCancelled?: boolean;
}

interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id'>) => void;
  cancelTicket: (id: string) => void;
  deleteTicket: (id: string) => void;
  getTicketStatus: (dateStr: string, isCancelled?: boolean) => TicketStatus;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const getTodayString = () => new Date().toISOString().split('T')[0];

const initialTickets: Ticket[] = [
  {
    id: '1',
    eventId: 'evt-101',
    title: 'Conferencia Tech 2026',
    date: '2026-10-15',
    attendeeName: 'Fernando Ros',
    email: 'fernando@ejemplo.com',
    phone: '9999-8888',
  },
  {
    id: '2',
    eventId: 'evt-105',
    title: 'Hackathon Estudiantil',
    date: getTodayString(),
    attendeeName: 'Fernando Ros',
    email: 'fernando@ejemplo.com',
    phone: '9999-8888',
  },
  {
    id: '3',
    eventId: 'evt-106',
    title: 'Taller de React Native',
    date: '2026-08-01',
    attendeeName: 'Fernando Ros',
    email: 'fernando@ejemplo.com',
    phone: '9999-8888',
  },
];

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);

  const getTicketStatus = (dateStr: string, isCancelled?: boolean): TicketStatus => {
    if (isCancelled) return 'cancelled';

    const todayStr = getTodayString();

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      if (dateStr === todayStr) return 'ongoing';
      if (dateStr > todayStr) return 'upcoming';
      return 'finished';
    }

    const monthMap: { [key: string]: string } = {
      enero: 'January', febrero: 'February', marzo: 'March', abril: 'April',
      mayo: 'May', junio: 'June', julio: 'July', agosto: 'August',
      septiembre: 'September', octubre: 'October', noviembre: 'November', diciembre: 'December'
    };

    let cleanDateStr = dateStr.toLowerCase();
    Object.keys(monthMap).forEach((esMonth) => {
      cleanDateStr = cleanDateStr.replace(esMonth, monthMap[esMonth]);
    });
    cleanDateStr = cleanDateStr.replace(/de /g, '');

    const eventDate = new Date(cleanDateStr);
    const now = new Date();

    if (isNaN(eventDate.getTime())) return 'upcoming';

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    if (eventDay.getTime() === today.getTime()) return 'ongoing';
    if (eventDay.getTime() > today.getTime()) return 'upcoming';
    return 'finished';
  };

  const addTicket = (newTicketData: Omit<Ticket, 'id'>) => {
    const newTicket: Ticket = {
      ...newTicketData,
      id: Date.now().toString(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const cancelTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCancelled: true } : t))
    );
  };

  const deleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <TicketContext.Provider
      value={{ tickets, addTicket, cancelTicket, deleteTicket, getTicketStatus }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) throw new Error('useTickets debe usarse dentro de un TicketProvider');
  return context;
};