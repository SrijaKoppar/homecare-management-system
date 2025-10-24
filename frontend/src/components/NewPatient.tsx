import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

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
  const [languageOptions] = useState(['English', 'Hindi', 'Tamil', 'Telugu']);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Radio buttons for Yes/No or Support Type
    if (type === 'radio') {
      const [category, field] = name.split('.');
      if (category === 'requirements') {
        setFormData((prev) => ({
          ...prev,
          requirements: {
            ...prev.requirements,
            [field]: value === 'yes',
          },
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
      return;
    }

    // Multi-select (Languages)
    if (e.target instanceof HTMLSelectElement && name === 'languages') {
      const options = Array.from(e.target.selectedOptions).map((o) => o.value);
      setFormData((prev) => ({ ...prev, languages: options }));
      return;
    }

    // Default
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLanguageToggle = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handleSubmit = () => {
    console.log('Submitted Patient:', formData);
    alert('✅ Patient registered successfully!');
    setFormData(initialFormState);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50/20 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10 overflow-y-auto">
      <Card className="w-full max-w-4xl p-8 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl transition-all duration-500">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
            🩺 New Patient Registration
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Fill in the patient’s details carefully. 
          </p>
        </CardHeader>

        <CardContent className="space-y-8 text-slate-700 dark:text-slate-300">
          {/* Personal Info */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">👤 Personal Information</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
              <input
                type="text"
                placeholder="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </section>

          {/* Contact Info */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">☎️ Contact Details</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
            <input
              type="text"
              placeholder="Residential Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input input-bordered w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            />
          </section>

          {/* Languages */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">🌐 Preferred Languages</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select one or more languages the patient is comfortable with.
            </p>
            <div className="flex flex-wrap gap-3">
              {languageOptions.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => handleLanguageToggle(lang)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                    formData.languages.includes(lang)
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </section>

          {/* Support Requested */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">🤝 Type of Support Required</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              What kind of support does the patient need?
            </p>
            <div className="flex gap-8">
              {['Nurse', 'Caretaker'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="supportRequested"
                    value={option}
                    checked={formData.supportRequested === option}
                    onChange={handleChange}
                    className="accent-emerald-500"
                  />
                  {option}
                </label>
              ))}
            </div>
          </section>

          {/* Work Type */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">🕒 Work Duration</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Is the patient looking for part-time or full-time assistance?
            </p>
            <div className="flex gap-8">
              {['Part-time', 'Full-time'].map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="workType"
                    value={option}
                    checked={formData.workType === option}
                    onChange={handleChange}
                    className="accent-emerald-500"
                  />
                  {option}
                </label>
              ))}
            </div>
          </section>

          {/* Care Requirements */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">❤️ Care Requirements</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Please answer these questions to assess the patient’s independence level.
            </p>

            <div className="space-y-4">
              {[
                { key: 'bedRidden', label: 'Is the patient bed-ridden?' },
                { key: 'canWalk', label: 'Can the patient walk independently?' },
                { key: 'wheelchair', label: 'Does the patient use a wheelchair?' },
                { key: 'canUseLavatory', label: 'Can the patient use the lavatory independently?' },
                { key: 'canEat', label: 'Can the patient eat independently?' },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col sm:flex-row justify-between items-center bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                  <p className="text-slate-800 dark:text-slate-100 text-sm sm:text-base">{label}</p>
                  <div className="flex gap-4 mt-2 sm:mt-0">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`requirements.${key}`}
                        value="yes"
                        checked={formData.requirements[key as keyof typeof formData.requirements] === true}
                        onChange={handleChange}
                        className="accent-emerald-500"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`requirements.${key}`}
                        value="no"
                        checked={formData.requirements[key as keyof typeof formData.requirements] === false}
                        onChange={handleChange}
                        className="accent-rose-500"
                      />
                      No
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Register Patient
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
