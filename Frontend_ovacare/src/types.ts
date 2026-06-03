export interface AuthData {
  name: string;
  email: string;
  password: string;
}

export interface PersonalData {
  firstName: string;
  lastName: string;
  age: string;
  city: string;
}

export interface CycleData {
  lastPeriodDate: string;
  cycleLength: string;
  currentPhase: string;
}

export interface PreferencesData {
  cuisine: string;
  healthGoal: string;
  movementType: string;
}

export interface AppState {
  auth: AuthData;
  personal: PersonalData;
  cycle: CycleData;
  preferences: PreferencesData;
}