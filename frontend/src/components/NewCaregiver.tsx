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
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          New Caregiver
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Enter caregiver personal and professional details.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">

        {/* Personal Information */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="input input-bordered p-2"
            />
            <input
              name="middleName"
              placeholder="Middle Name"
              value={formData.middleName}
              onChange={handleChange}
              className="input input-bordered p-2"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="input input-bordered p-2"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="input input-bordered p-2"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input input-bordered p-2"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Contact Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="input input-bordered p-2"
            />
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered p-2"
            />
          </div>

          <input
            name="address"
            placeholder="Residential Address"
            value={formData.address}
            onChange={handleChange}
            className="input input-bordered p-2 w-full"
          />
        </section>

        {/* Languages */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Known Languages
          </h2>

          <select
            multiple
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            className="input input-bordered p-2 w-full h-32"
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </section>

        {/* Documents */}
        <section className="space-y-4">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Documents & Banking
          </h2>

          <input
            name="addressProof"
            placeholder="Address Proof"
            value={formData.addressProof}
            onChange={handleChange}
            className="input input-bordered p-2 w-full"
          />

          <div className="grid md:grid-cols-3 gap-4">
            <input
              name="bankName"
              placeholder="Bank Name"
              value={formData.bankName}
              onChange={handleChange}
              className="input input-bordered p-2"
            />
            <input
              name="accountNumber"
              placeholder="Account Number"
              value={formData.accountNumber}
              onChange={handleChange}
              className="input input-bordered p-2"
            />
            <input
              name="ifscCode"
              placeholder="IFSC Code"
              value={formData.ifscCode}
              onChange={handleChange}
              className="input input-bordered p-2"
            />
          </div>

          <textarea
            name="priorExperience"
            placeholder="Prior Experience"
            value={formData.priorExperience}
            onChange={handleChange}
            className="input input-bordered p-2 w-full"
          />

          <input
            name="qualification"
            placeholder="Qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="input input-bordered p-2 w-full"
          />
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
          >
            {loading ? 'Saving...' : 'Save Caregiver'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewCaregiver;
