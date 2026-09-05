// src/context/EventContext.tsx
import React, { createContext, useContext, useState } from 'react';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  displayDate: string;
  location: string;
  category: string;
}

interface EventContextType {
  events: EventItem[];
  addEvent: (newEvent: Omit<EventItem, 'id'>) => void;
}

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-101',
    title: 'Tech Summit 2026',
    date: '15-10-2026',
    displayDate: '15-10-2026',
    location: 'Centro de Convenciones',
    category: 'Tecnología',
  },
  {
    id: 'evt-102',
    title: 'Festival de Música Pop',
    date: '20-11-2026',
    displayDate: '20-11-2026',
    location: 'Estadio Nacional',
    category: 'Música',
  },
  {
    id: 'evt-103',
    title: 'Expo Gastronomía & Vino',
    date: '05-12-2026',
    displayDate: '05-12-2026',
    location: 'Parque Central',
    category: 'Comida',
  },
  {
    id: 'evt-104',
    title: 'Maratón Nocturna 10K',
    date: '12-12-2026',
    displayDate: '12-12-2026',
    location: 'Avenida Principal',
    category: 'Deportes',
  },
];

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);

  const addEvent = (newEventData: Omit<EventItem, 'id'>) => {
    const newEvent: EventItem = {
      ...newEventData,
      id: `evt-${Date.now()}`,
    };
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
  };

  return (
    <EventContext.Provider value={{ events, addEvent }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents debe usarse dentro de un EventProvider');
  return context;
};

export default EventProvider;