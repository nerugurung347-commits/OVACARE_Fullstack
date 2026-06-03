import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormField from '../components/FormField';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import type { PersonalData } from '../types';

interface PersonalDetailsPageProps {
  data: PersonalData;
  onComplete: (data: PersonalData) => void;
}

function PersonalDetailsPage({ data, onComplete }: PersonalDetailsPageProps) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(data.firstName || '');
  const [lastName, setLastName] = useState(data.lastName || '');
  const [age, setAge] = useState(data.age || '');
  const [city, setCity] = useState(data.city || '');
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    age: false,
    city: false,
  });

  const errors = {
    firstName: !firstName.trim() ? 'First name is required' : '',
    lastName: !lastName.trim() ? 'Last name is required' : '',
    age: !age.trim()
      ? 'Age is required'
      : isNaN(Number(age)) || Number(age) < 12 || Number(age) > 50
      ? 'Please enter a valid age between 12 and 50'
      : '',
    city: !city.trim() ? 'City is required' : '',
  };

  const isValid = !errors.firstName && !errors.lastName && !errors.age && !errors.city;

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onComplete({ firstName: firstName.trim(), lastName: lastName.trim(), age, city: city.trim() });
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
        <ProgressBar currentStep={1} totalSteps={4} />

        <h1 className="text-3xl font-bold text-primary-600 text-center mb-2 mt-6">
          Personal Details
        </h1>
        <p className="text-gray-500 italic text-center mb-8">
          Tell us about yourself
        </p>

        <form onSubmit={handleSubmit}>
          <div onBlur={() => handleBlur('firstName')}>
            <FormField
              label="First Name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={errors.firstName}
              touched={touched.firstName}
              placeholder="Enter your first name"
            />
          </div>

          <div onBlur={() => handleBlur('lastName')}>
            <FormField
              label="Last Name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={errors.lastName}
              touched={touched.lastName}
              placeholder="Enter your last name"
            />
          </div>

          <div onBlur={() => handleBlur('age')}>
            <FormField
              label="Age"
              type="text"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              error={errors.age}
              touched={touched.age}
              placeholder="Enter your age"
            />
          </div>

          <div onBlur={() => handleBlur('city')}>
            <FormField
              label="City"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              error={errors.city}
              touched={touched.city}
              placeholder="Enter your city"
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

export default PersonalDetailsPage;