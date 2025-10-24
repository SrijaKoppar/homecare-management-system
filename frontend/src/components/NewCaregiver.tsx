import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';

interface CaregiverForm {
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
}

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
  const [languageOptions] = useState(['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada']);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Multi-select for languages
    if (e.target instanceof HTMLSelectElement && name === 'languages') {
      const options = Array.from(e.target.selectedOptions).map((o) => o.value);
      setFormData((prev) => ({ ...prev, languages: options }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log('Submitted Caregiver:', formData);
    alert('✅ Caregiver registered successfully!');
    setFormData(initialFormState);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-teal-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10 overflow-y-auto">
      <Card className="w-full max-w-4xl p-8 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl transition-all duration-500">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-blue-700 dark:text-emerald-400">
            🧑‍⚕️ New Caregiver Registration
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Fill in the caregiver’s personal and professional details carefully.
          </p>
        </CardHeader>

        <CardContent className="space-y-8 text-slate-700 dark:text-slate-300">

          {/* Personal Info */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">👤 Personal Information</h3>
            <div className="flex flex-col md:flex-row gap-3">
              {['firstName', 'middleName', 'lastName'].map((field, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={
                    field === 'firstName'
                      ? 'First Name'
                      : field === 'middleName'
                      ? 'Middle Name'
                      : 'Last Name'
                  }
                  name={field}
                  value={formData[field as keyof CaregiverForm] || ''}
                  onChange={handleChange}
                  className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              ))}
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
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Height (cm)"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
              <input
                type="text"
                placeholder="Weight (kg)"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="input input-bordered flex-1 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </section>

          {/* Contact Info */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">📞 Contact Information</h3>
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

          {/* Known Languages */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">🌐 Known Languages</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Select all languages the caregiver is fluent in.</p>
            <select
              multiple
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              className="input input-bordered w-full h-32 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
            >
              {languageOptions.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </section>

          {/* Documents */}
          <section className="space-y-3">
            <h3 className="font-semibold text-xl text-slate-900 dark:text-white">📄 Documents</h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Address Proof (Aadhar Card Number)"
                name="addressProof"
                value={formData.addressProof}
                onChange={handleChange}
                className="input input-bordered w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />

              <div className="grid md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Bank Name"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="input input-bordered p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
                <input
                  type="text"
                  placeholder="Account Number"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="input input-bordered p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
                <input
                  type="text"
                  placeholder="IFSC Code"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className="input input-bordered p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
                />
              </div>

              <textarea
                placeholder="Prior Experience (if any)"
                name="priorExperience"
                value={formData.priorExperience}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />

              <input
                type="text"
                placeholder="Qualification (if applicable)"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="input input-bordered w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />

              <input
                type="text"
                placeholder="Proof of Qualification (if applicable)"
                name="qualificationProof"
                value={formData.qualificationProof}
                onChange={handleChange}
                className="input input-bordered w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700"
              />
            </div>
          </section>

          {/* Submit */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-lg rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Register Caregiver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
