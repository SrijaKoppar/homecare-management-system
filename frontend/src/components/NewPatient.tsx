import React, { useState } from 'react';
import { Button } from './ui/button';
import { API_BASE } from '../config/api';

interface PatientForm {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  gender: string;
  height: string;
  weight: string;
  languages: string[];
  supportRequested: string;
  workType: string;
  requirements: {
    bedRidden: boolean | null;
    canWalk: boolean | null;
    wheelchair: boolean | null;
    canUseLavatory: boolean | null;
    canEat: boolean | null;
  };
}

const initialFormState: PatientForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  dob: '',
  gender: '',
  height: '',
  weight: '',
  languages: [],
  supportRequested: '',
  workType: '',
  requirements: {
    bedRidden: null,
    canWalk: null,
    wheelchair: null,
    canUseLavatory: null,
    canEat: null,
  },
};

export function NewPatient() {
  const [formData, setFormData] = useState<PatientForm>(initialFormState);
  const [loading, setLoading] = useState(false);

  const languageOptions = ['English', 'Hindi', 'Tamil', 'Telugu'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('requirements.')) {
      const key = name.split('.')[1] as keyof PatientForm['requirements'];
      setFormData((prev) => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          [key]: value === 'yes',
        },
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const validate = () => {
    if (!formData.firstName.trim()) return 'First name required';
    if (!formData.lastName.trim()) return 'Last name required';
    if (!/^\d{7,15}$/.test(formData.phone))
      return 'Phone must be 7–15 digits';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      return 'Invalid email';
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Patient registered successfully');
      setFormData(initialFormState);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          New Patient
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter patient details and care requirements.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-8">

        {/* Personal Information */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="input input-bordered p-2" />
            <input name="middleName" placeholder="Middle Name" value={formData.middleName} onChange={handleChange} className="input input-bordered p-2" />
            <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="input input-bordered p-2" />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input input-bordered p-2" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="input input-bordered p-2">
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </section>

        {/* Contact Details */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Contact Details
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="input input-bordered p-2" />
            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input input-bordered p-2" />
          </div>

          <input name="address" placeholder="Residential Address" value={formData.address} onChange={handleChange} className="input input-bordered p-2 w-full" />
        </section>

        {/* Languages */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Preferred Languages
          </h2>

          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`px-4 py-2 rounded-md text-sm border ${
                  formData.languages.includes(lang)
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>

        {/* Support Type */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Support Required
          </h2>

          <div className="flex gap-6">
            {['Nurse', 'Caretaker'].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="supportRequested"
                  value={option}
                  checked={formData.supportRequested === option}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}
          </div>
        </section>

        {/* Care Requirements */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Care Requirements
          </h2>

          {Object.keys(formData.requirements).map((key) => (
            <div key={key} className="flex justify-between items-center border p-3 rounded-md">
              <span className="text-sm capitalize">{key}</span>
              <div className="flex gap-4">
                <label>
                  <input
                    type="radio"
                    name={`requirements.${key}`}
                    value="yes"
                    checked={formData.requirements[key as keyof typeof formData.requirements] === true}
                    onChange={handleChange}
                  /> Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`requirements.${key}`}
                    value="no"
                    checked={formData.requirements[key as keyof typeof formData.requirements] === false}
                    onChange={handleChange}
                  /> No
                </label>
              </div>
            </div>
          ))}
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
          >
            {loading ? 'Saving...' : 'Save Patient'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewPatient;
