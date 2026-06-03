import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import PersonalDetailsPage from './pages/PersonalDetailsPage';
import CycleSetupPage from './pages/CycleSetupPage';
import PreferencesPage from './pages/PreferencesPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ProtectedRoute from './components/ProtectedRoute';
import type { AppState, AuthData, PersonalData, CycleData, PreferencesData } from './types';

// --- Main App ---

function App() {
  const navigate = useNavigate();

  const [state, setState] = useState<AppState>({
    auth: { name: '', email: '', password: '' },
    personal: { firstName: '', lastName: '', age: '', city: '' },
    cycle: { lastPeriodDate: '', cycleLength: '', currentPhase: '' },
    preferences: { cuisine: '', healthGoal: '', movementType: '' },
  });

  const handleAuthComplete = (auth: AuthData) => {
    setState((prev) => ({ ...prev, auth }));
    navigate('/personal');
  };

  const handlePersonalComplete = (personal: PersonalData) => {
    setState((prev) => ({ ...prev, personal }));
    navigate('/cycle');
  };

  const handleCycleComplete = (cycle: CycleData) => {
    setState((prev) => ({ ...prev, cycle }));
    navigate('/preferences');
  };

  const handlePreferencesComplete = (preferences: PreferencesData) => {
    setState((prev) => ({ ...prev, preferences }));
    navigate('/confirmed');
  };

  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />
      <Route path="/login" element={<SignInPage data={state.auth} onComplete={handleAuthComplete} />} />
      <Route path="/personal" element={
        <ProtectedRoute>
          <PersonalDetailsPage data={state.personal} onComplete={handlePersonalComplete} />
        </ProtectedRoute>
      } />
      <Route path="/cycle" element={
        <ProtectedRoute>
          <CycleSetupPage data={state.cycle} onComplete={handleCycleComplete} />
        </ProtectedRoute>
      } />
      <Route path="/preferences" element={
        <ProtectedRoute>
          <PreferencesPage data={state.preferences} onComplete={handlePreferencesComplete} />
        </ProtectedRoute>
      } />
      <Route path="/confirmed" element={
        <ProtectedRoute>
          <ConfirmationPage
            personalData={state.personal}
            cycleData={state.cycle}
            preferencesData={state.preferences}
            onReset={() => {
              localStorage.removeItem('ovacare_token');
              setState({
                auth: { name: '', email: '', password: '' },
                personal: { firstName: '', lastName: '', age: '', city: '' },
                cycle: { lastPeriodDate: '', cycleLength: '', currentPhase: '' },
                preferences: { cuisine: '', healthGoal: '', movementType: '' },
              });
              navigate('/');
            }}
          />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;