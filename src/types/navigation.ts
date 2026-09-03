export type AuthStackParamList = {
  Login: undefined;
  MainTabs: { email?: string };
};

export type MainTabParamList = {
  Home: undefined;
  Register: undefined;
  Profile: { email?: string };
};