import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import type { CycleData } from '../types';

interface CycleSetupPageProps {
  data: CycleData;
  onComplete: (data: CycleData) => void;
}

interface PhaseInfo {
  emoji: string;
  name: string;
  description: string;
  bgColor: string;
}

const phaseConfig: Record<string, PhaseInfo> = {
  Menstrual: {
    emoji: '🌙',
    name: 'Menstrual',
    description: 'Rest and restore',
    bgColor: 'bg-purple-100',
  },
  Follicular: {
    emoji: '🌱',
    name: 'Follicular',
    description: 'Energy rising',
    bgColor: 'bg-green-100',
  },
  Ovulatory: {
    emoji: '🌟',
    name: 'Ovulatory',
    description: 'Peak energy',
    bgColor: 'bg-yellow-100',
  },
  Luteal: {
    emoji: '🍂',
    name: 'Luteal',
    description: 'Wind down',
    bgColor: 'bg-orange-100',
  },
};

const detectPhase = (dateStr: string): string => {
  if (!dateStr) return '';
  const lastPeriod = new Date(dateStr);
  const today = new Date();
  const diffTime = today.getTime() - lastPeriod.getTime();
  const daysSince = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (daysSince >= 1 && daysSince <= 5) return 'Menstrual';
  if (daysSince >= 6 && daysSince <= 13) return 'Follicular';
  if (daysSince >= 14 && daysSince <= 16) return 'Ovulatory';
  if (daysSince >= 17) return 'Luteal';
  return '';
};

const cycleLengthOptions = Array.from({ length: 15 }, (_, i) => ({
  value: String(21 + i),
  label: `${21 + i} days`,
}));

function CycleSetupPage({ data, onComplete }: CycleSetupPageProps) {
  const navigate = useNavigate();
  const [lastPeriodDate, setLastPeriodDate] = useState(data.lastPeriodDate || '');
  const [cycleLength, setCycleLength] = useState(data.cycleLength || '');
  const [currentPhase, setCurrentPhase] = useState(data.currentPhase || '');
  const [touched, setTouched] = useState({
    lastPeriodDate: false,
    cycleLength: false,
  });

  useEffect(() => {
    if (lastPeriodDate) {
      setCurrentPhase(detectPhase(lastPeriodDate));
    } else {
      setCurrentPhase('');
    }
  }, [lastPeriodDate]);

  const errors = {
    lastPeriodDate: !lastPeriodDate.trim() ? 'Last period date is required' : '',
    cycleLength: !cycleLength.trim() ? 'Cycle length is required' : '',
  };

  const isValid = !errors.lastPeriodDate && !errors.cycleLength;

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onComplete({ lastPeriodDate, cycleLength, currentPhase });
    }
  };

  const phaseInfo = currentPhase ? phaseConfig[currentPhase] : null;

  return (
    <div className="min-h-screen bg-primary-100 flex items-center justify-center p-4 page-fade">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-[480px] p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          ← Back
        </button>
        <ProgressBar currentStep={2} totalSteps={4} />

        <h1 className="text-3xl font-bold text-primary-600 text-center mb-2 mt-6">
          Cycle Setup
        </h1>
        <p className="text-gray-500 italic text-center mb-8">
          Help us understand your cycle
        </p>

        <form onSubmit={handleSubmit}>
          <div onBlur={() => handleBlur('lastPeriodDate')}>
            <FormField
              label="Last Period Start Date"
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              error={errors.lastPeriodDate}
              touched={touched.lastPeriodDate}
            />
          </div>

          <div onBlur={() => handleBlur('cycleLength')}>
            <FormField
              label="Cycle Length"
              type="select"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              error={errors.cycleLength}
              touched={touched.cycleLength}
              options={cycleLengthOptions}
            />
          </div>

          {phaseInfo && (
            <div className={`${phaseInfo.bgColor} rounded-xl p-4 mt-4`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{phaseInfo.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-800">{phaseInfo.name}</p>
                  <p className="text-sm text-gray-600">{phaseInfo.description}</p>
                </div>
              </div>
            </div>
          )}

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

export default CycleSetupPage;