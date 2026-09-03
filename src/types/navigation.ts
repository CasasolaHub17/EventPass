export type MainTabParamList = {
  Home: undefined;
  Events: undefined;
  Register: undefined;
  Profile: {
    email?: string;
    newTicket?: { id: string; title: string; date: string };
  };
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: {
    screen?: keyof MainTabParamList;
    params?: any;
  };
};