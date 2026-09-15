import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  date: string;
}

interface EventsState {
  eventsList: EventItem[];
}

const initialState: EventsState = {
  eventsList: [],
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<EventItem>) => {
      state.eventsList.push(action.payload);
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.eventsList = state.eventsList.filter(e => e.id !== action.payload);
    },
  },
});

export const { addEvent, removeEvent } = eventsSlice.actions;
export default eventsSlice.reducer;