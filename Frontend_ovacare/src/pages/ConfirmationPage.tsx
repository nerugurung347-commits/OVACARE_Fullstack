import { useState, useEffect } from 'react';
import Button from '../components/Button';
import { saveProfile } from '../api';
import type { PersonalData, CycleData, PreferencesData } from '../types';

interface ConfirmationPageProps {
  personalData: PersonalData;
  cycleData: CycleData;
  preferencesData: PreferencesData;
  onReset: () => void;
}

const phaseInfo: Record<string, { emoji: string; message: string }> = {
  Menstrual: { emoji: '🌙', message: 'Rest and restore your energy' },
  Follicular: { emoji: '🌱', message: 'Your energy is building — embrace new beginnings' },
  Ovulatory: { emoji: '🌟', message: 'Peak energy — your best time to shine' },
  Luteal: { emoji: '🍂', message: 'Wind down and prepare for renewal' },
};

const cuisineLabels: Record<string, string> = {
  'south-asian': 'South Asian',
  'east-asian': 'East Asian',
  western: 'Western',
  'middle-eastern': 'Middle Eastern',
  african: 'African',
  mediterranean: 'Mediterranean',
};

const healthGoalLabels: Record<string, string> = {
  'hormonal-balance': 'Hormonal Balance',
  energy: 'Boost Energy',
  'weight-management': 'Weight Management',
  fitness: 'Fitness Performance',
  stress: 'Stress Reduction',
};

const movementTypeLabels: Record<string, string> = {
  yoga: 'Yoga',
  strength: 'Strength Training',
  cardio: 'Cardio',
  'low-impact': 'Low Impact',
  pilates: 'Pilates',
  hiit: 'HIIT',
};

const nutritionTips: Record<string, string> = {
  Menstrual: 'Focus on iron-rich foods like spinach and lentils to replenish energy',
  Follicular: 'Eat fresh vegetables and lean proteins to support your rising energy',
  Ovulatory: 'Add anti-inflammatory foods like berries and salmon to your meals',
  Luteal: 'Reach for magnesium-rich foods like dark chocolate and nuts for cravings',
  default: 'Eat whole foods and stay hydrated throughout your cycle',
};

const movementTips: Record<string, string> = {
  yoga: 'A gentle flow yoga session will help you connect with your body today',
  strength: 'This is a great time to focus on compound lifts and progressive overload',
  cardio: 'Go for a run or cycling session to match your current energy level',
  'low-impact': 'A slow walk or swimming session will support your body gently',
  pilates: 'Core-focused pilates will strengthen and centre you today',
  hiit: 'Channel your energy into a high-intensity interval session today',
  default: 'Move in a way that feels good for your body today',
};

function ConfirmationPage({
  personalData,
  cycleData,
  preferencesData,
  onReset,
}: ConfirmationPageProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      'ovacareData',
      JSON.stringify({
        personal: personalData,
        cycle: cycleData,
        preferences: preferencesData,
      })
    );

    const token = localStorage.getItem('ovacare_token');
    if (!token || saved) return;

    const saveToBackend = async () => {
      setSaving(true);
      setSaveError('');
      try {
        await saveProfile({
          profile: {
            full_name: `${personalData.firstName} ${personalData.lastName}`.trim(),
            age: personalData.age,
            city: personalData.city,
          },
          cycle_data: {
            last_period_date: cycleData.lastPeriodDate,
            cycle_length: cycleData.cycleLength,
            current_phase: cycleData.currentPhase,
          },
          preferences: {
            cuisine: preferencesData.cuisine,
            health_goal: preferencesData.healthGoal,
            movement_type: preferencesData.movementType,
          },
        });
        setSaved(true);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to save data to server.';
        setSaveError(message);
      } finally {
        setSaving(false);
      }
    };

    saveToBackend();
  }, [personalData, cycleData, preferencesData, saved]);

  const lastPeriod = new Date(cycleData.lastPeriodDate);
  const today = new Date();
  const diffTime = today.getTime() - lastPeriod.getTime();
  const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Advisory Screen: shown when days since last period > 90 and user hasn't chosen to continue
  if (daysSince > 90 && !showSuccess) {
    return (
      <div className="min-h-screen bg-primary-100 flex items-center justify-center p-4 page-fade">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-[480px] p-8">
          {/* Orange Advisory Icon */}
          <div className="flex justify-center mt-4 mb-6">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-5xl font-bold text-orange-500">!</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-primary-600 text-center mb-2">
            Let's Check In First
          </h1>

          {/* Subheading */}
          <p className="text-sm italic text-gray-500 text-center mb-6">
            We noticed something worth addressing
          </p>

          {/* Message */}
          <p className="text-gray-600 text-center text-sm leading-relaxed mb-8">
            Your last recorded period was over 90 days ago. While this can occur for many natural reasons — including postpartum recovery, breastfeeding, or coming off contraception — it may also be worth discussing with a healthcare professional before relying on cycle-based guidance.
            <br /><br />
            Ovacare is designed to support active menstrual cycles. For the most personalised and safe experience, we recommend a quick check-in with your GP first.
          </p>

          {saveError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {saveError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              label="Speak to a GP"
              onClick={() => window.open('https://www.healthdirect.gov.au', '_blank')}
              variant="primary"
              fullWidth
            />
            <Button
              label="Continue to Ovacare"
              onClick={() => setShowSuccess(true)}
              variant="secondary"
              fullWidth
              loading={saving}
            />
          </div>
        </div>
      </div>
    );
  }

  // Existing Success Screen (unchanged)
  const phase = phaseInfo[cycleData.currentPhase] || {
    emoji: '✨',
    message: 'Your journey begins now',
  };

  return (
    <div className="min-h-screen bg-primary-100 flex items-center justify-center p-4 page-fade">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[480px] p-8">
        {/* Success Checkmark */}
        <div className="flex justify-center mt-4 mb-6">
          <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-5xl">✓</span>
          </div>
        </div>

        {/* Welcome Message */}
        <h1 className="text-3xl font-bold text-primary-600 text-center mb-8">
          Welcome to Ovacare, {personalData.firstName}!
        </h1>

        {/* Phase Card */}
        <div className="bg-primary-100 rounded-xl p-5 mb-6 text-center">
          <span className="text-4xl block mb-2">{phase.emoji}</span>
          <p className="text-lg font-semibold text-primary-600 capitalize mb-1">
            {cycleData.currentPhase} Phase
          </p>
          <p className="text-gray-600 italic">{phase.message}</p>
        </div>

        {/* Preferences Summary */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
            Your Preferences
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Cuisine</span>
              <span className="font-medium text-primary-600">
                {cuisineLabels[preferencesData.cuisine] || preferencesData.cuisine}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Health Goal</span>
              <span className="font-medium text-primary-600">
                {healthGoalLabels[preferencesData.healthGoal] || preferencesData.healthGoal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Movement</span>
              <span className="font-medium text-primary-600">
                {movementTypeLabels[preferencesData.movementType] || preferencesData.movementType}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Ovacare Tip */}
        <div className="bg-primary-100 rounded-xl p-5 mb-6 border-l-4 border-primary-500">
          <h2 className="text-lg font-bold text-primary-600 mb-3">
            Your Daily Ovacare Tip 🌿
          </h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              🥗 {nutritionTips[cycleData.currentPhase] || nutritionTips.default}
            </p>
            <p className="text-gray-700">
              🏃‍♀️ {movementTips[preferencesData.movementType] || movementTips.default}
            </p>
          </div>
        </div>

        {saveError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {saveError}
          </div>
        )}

        {/* Get Started Button */}
        <Button label="Get Started" onClick={onReset} fullWidth loading={saving} />
      </div>
    </div>
  );
}

export default ConfirmationPage;