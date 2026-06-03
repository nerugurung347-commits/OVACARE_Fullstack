import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import type { PreferencesData } from '../types';

interface PreferencesPageProps {
  data: PreferencesData;
  onComplete: (data: PreferencesData) => void;
}

const cuisineOptions = [
  { value: 'south-asian', label: 'South Asian' },
  { value: 'east-asian', label: 'East Asian' },
  { value: 'western', label: 'Western' },
  { value: 'middle-eastern', label: 'Middle Eastern' },
  { value: 'african', label: 'African' },
  { value: 'mediterranean', label: 'Mediterranean' },
];

const healthGoalOptions = [
  { value: 'hormonal-balance', label: 'Hormonal Balance' },
  { value: 'energy', label: 'Boost Energy' },
  { value: 'weight-management', label: 'Weight Management' },
  { value: 'fitness', label: 'Fitness Performance' },
  { value: 'stress', label: 'Stress Reduction' },
];

const movementTypeOptions = [
  { value: 'yoga', label: 'Yoga' },
  { value: 'strength', label: 'Strength Training' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'low-impact', label: 'Low Impact' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'hiit', label: 'HIIT' },
];

function PreferencesPage({ data, onComplete }: PreferencesPageProps) {
  const navigate = useNavigate();
  const [cuisine, setCuisine] = useState(data.cuisine || '');
  const [healthGoal, setHealthGoal] = useState(data.healthGoal || '');
  const [movementType, setMovementType] = useState(data.movementType || '');
  const [touched, setTouched] = useState({
    cuisine: false,
    healthGoal: false,
    movementType: false,
  });

  const errors = {
    cuisine: !cuisine.trim() ? 'Cuisine preference is required' : '',
    healthGoal: !healthGoal.trim() ? 'Health goal is required' : '',
    movementType: !movementType.trim() ? 'Movement type is required' : '',
  };

  const isValid = !errors.cuisine && !errors.healthGoal && !errors.movementType;

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onComplete({ cuisine, healthGoal, movementType });
    }
  };

  return (
    <div className="min-h-screen bg-primary-100 flex items-center justify-center p-4 page-fade">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[480px] p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          ← Back
        </button>
        <ProgressBar currentStep={3} totalSteps={4} />

        <h1 className="text-3xl font-bold text-primary-600 text-center mb-2 mt-6">
          Your Preferences
        </h1>
        <p className="text-gray-500 italic text-center mb-8">
          Personalise your Ovacare experience
        </p>

        <form onSubmit={handleSubmit}>
          <div onBlur={() => handleBlur('cuisine')}>
            <FormField
              label="Cuisine Preference"
              type="select"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              error={errors.cuisine}
              touched={touched.cuisine}
              options={cuisineOptions}
            />
          </div>

          <div onBlur={() => handleBlur('healthGoal')}>
            <FormField
              label="Health Goal"
              type="select"
              value={healthGoal}
              onChange={(e) => setHealthGoal(e.target.value)}
              error={errors.healthGoal}
              touched={touched.healthGoal}
              options={healthGoalOptions}
            />
          </div>

          <div onBlur={() => handleBlur('movementType')}>
            <FormField
              label="Movement Type"
              type="select"
              value={movementType}
              onChange={(e) => setMovementType(e.target.value)}
              error={errors.movementType}
              touched={touched.movementType}
              options={movementTypeOptions}
            />
          </div>

          <div className="mt-6">
            <Button
              label="Continue"
              type="submit"
              fullWidth
              disabled={!isValid}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default PreferencesPage;