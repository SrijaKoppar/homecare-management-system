import React, { useState } from 'react';
import { Button } from './ui/button';
import { API_BASE } from '../config/api';

type CaregiverForm = {
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
  addressProof: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  priorExperience: string;
  qualification: string;
  qualificationProof: string;
};

const initialFormState: CaregiverForm = {
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
  addressProof: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  priorExperience: '',
  qualification: '',
  qualificationProof: '',
};

export function NewCaregiver() {
  const [formData, setFormData] = useState<CaregiverForm>(initialFormState);
  const [loading, setLoading] = useState(false);

  const languageOptions = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'languages') {
      const options = Array.from(
        (e.target as HTMLSelectElement).selectedOptions
      ).map((o) => o.value);
      setFormData((prev) => ({ ...prev, languages: options }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.firstName.trim()) return 'First name required';
    if (!formData.lastName.trim()) return 'Last name required';
    if (!/^\d{7,15}$/.test(formData.phone)) return 'Phone should be 7–15 digits';
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
      const res = await fetch(`${API_BASE}/api/caregivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(await res.text());

      alert('Caregiver registered successfully');
      setFormData(initialFormState);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
  
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
          Caregiver Registration
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Enter personal, professional, and banking details of the caregiver.
        </p>
      </div>
  
      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-12">
  
        {/* Personal Information */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">
            Personal Information
          </h2>
  
          <div className="grid md:grid-cols-3 gap-6">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            />
            <input
              name="middleName"
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            />
          </div>
  
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </section>
  
        {/* Contact Information */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">
            Contact Information
          </h2>
  
          <div className="grid md:grid-cols-2 gap-6">
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            />
            <input
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            />
          </div>
  
          <textarea
            name="address"
            placeholder="Residential Address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="input input-bordered p-3 rounded-lg w-full"
          />
        </section>
  
        {/* Languages */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">
            Known Languages
          </h2>
  
          <div className="flex flex-wrap gap-3">
            {languageOptions.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    languages: prev.languages.includes(lang)
                      ? prev.languages.filter((l) => l !== lang)
                      : [...prev.languages, lang],
                  }))
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  formData.languages.includes(lang)
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </section>
  
        {/* Documents & Banking */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">
            Documents & Banking Details
          </h2>
  
          <input
            name="addressProof"
            placeholder="Address Proof Document"
            value={formData.addressProof}
            onChange={handleChange}
            className="input input-bordered p-3 rounded-lg w-full"
          />
  
          <div className="grid md:grid-cols-3 gap-6">
            <input
              name="bankName"
              placeholder="Bank Name"
              value={formData.bankName}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            />
            <input
              name="accountNumber"
              placeholder="Account Number"
              value={formData.accountNumber}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            />
            <input
              name="ifscCode"
              placeholder="IFSC Code"
              value={formData.ifscCode}
              onChange={handleChange}
              className="input input-bordered p-3 rounded-lg"
            />
          </div>
        </section>
  
        {/* Professional Details */}
        <section className="space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">
            Professional Details
          </h2>
  
          <textarea
            name="priorExperience"
            placeholder="Describe Prior Experience"
            value={formData.priorExperience}
            onChange={handleChange}
            rows={3}
            className="input input-bordered p-3 rounded-lg w-full"
          />
  
          <input
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="input input-bordered p-3 rounded-lg w-full"
          />
        </section>
  
        {/* Submit */}
        <div className="flex justify-end pt-6 border-t">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg shadow-md"
          >
            {loading ? 'Saving...' : 'Register Caregiver'}
          </Button>
        </div>
      </div>
    </div>
  );
}
