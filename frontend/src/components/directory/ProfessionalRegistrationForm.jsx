import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { professionalService } from '../../services/professionalService';
import toast from 'react-hot-toast';
import { getPhotoUrl } from '../../services/api';
import { FiCamera } from 'react-icons/fi';

const roleOptions = [
  { value: 'police_officer', label: 'Police Officer', bn_label: 'পুলিশ অফিসার' },
  { value: 'lawyer', label: 'Lawyer', bn_label: 'উকিল' },
  { value: 'judge', label: 'Judge', bn_label: 'বিচারক' },
  { value: 'magistrate', label: 'Magistrate', bn_label: 'ম্যাজিস্ট্রেট' },
  { value: 'court_official', label: 'Court Official', bn_label: 'আদালত কর্মকর্তা' },
];

const initialFormState = {
  name: '', bn_name: '', gender: '', date_of_birth: '',
  email: '', phone: '', present_address: '', bn_present_address: '',
  permanent_address: '', bn_permanent_address: '',
  nid: '', passport_no: '',
  education: [], training: [], awards: [], languages_known: [],
  years_of_experience: 0,
  badge_no: '', rank: '', thana: '',
  bar_council_no: '', lawyer_type: '', specialization: [], law_firm: '',
  office_address: '', bn_office_address: '',
  judge_type: '', court: '',
  magistrate_type: '',
};

export default function ProfessionalRegistrationForm() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleRoleSelect = (r) => {
    setRole(r);
    setStep(2);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error(isBn ? 'ছবির সাইজ ৫এমবি এর কম হতে হবে' : 'Photo must be under 5MB');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const cleanData = { ...form, role, date_of_birth: form.date_of_birth || undefined };
      Object.keys(cleanData).forEach(k => {
        if (cleanData[k] === '' || cleanData[k] === null) {
          delete cleanData[k];
        }
        if (Array.isArray(cleanData[k]) && cleanData[k].length === 0) {
          delete cleanData[k];
        }
      });
      const res = await professionalService.create(cleanData);
      const professionalId = res.data.data._id;
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        await professionalService.uploadPhoto(professionalId, formData);
      }
      toast.success(isBn ? 'নিবন্ধন সফল হয়েছে!' : 'Registration successful!');
      navigate('/directory');
    } catch (err) {
      const msg = err.response?.data?.message || (isBn ? 'নিবন্ধন ব্যর্থ হয়েছে' : 'Registration failed');
      const errors = err.response?.data?.errors;
      if (errors && errors.length > 0) {
        errors.forEach(e => toast.error(`${e.field}: ${e.message}`));
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-justice-navy mb-2">
            {isBn ? 'প্রফেশনাল রেজিস্ট্রেশন' : 'Professional Registration'}
          </h2>
          <p className="text-gray-600">
            {isBn ? 'আপনার ভূমিকা নির্বাচন করুন' : 'Choose your role'}
          </p>
        </div>
        <div className="grid gap-4">
          {roleOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleRoleSelect(opt.value)}
              className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-card hover:shadow-card-hover border-2 border-transparent hover:border-justice-gold transition-all text-left"
            >
              <div>
                <p className="text-xl font-bold text-justice-navy">{isBn ? opt.bn_label : opt.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-card p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-justice-navy">
            {isBn ? 'প্রফেশনাল রেজিস্ট্রেশন' : 'Professional Registration'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isBn ? 'সকল তথ্য সঠিকভাবে পূরণ করুন' : 'Fill in all the details accurately'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-justice-navy mb-4">
              {isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Information'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'নাম (ইংরেজি)' : 'Name (English)'} *</label>
                <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'নাম (বাংলা)' : 'Name (Bengali)'} *</label>
                <input type="text" value={form.bn_name} onChange={e => update('bn_name', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'এনআইডি' : 'NID'}</label>
                <input type="text" value={form.nid} onChange={e => update('nid', e.target.value)} className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'লিঙ্গ' : 'Gender'}</label>
                <select value={form.gender} onChange={e => update('gender', e.target.value)} className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold">
                  <option value="">{isBn ? 'নির্বাচন করুন' : 'Select'}</option>
                  <option value="Male">{isBn ? 'পুরুষ' : 'Male'}</option>
                  <option value="Female">{isBn ? 'মহিলা' : 'Female'}</option>
                  <option value="Other">{isBn ? 'অন্যান্য' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'জন্ম তারিখ' : 'Date of Birth'}</label>
                <input type="date" value={form.date_of_birth} onChange={e => update('date_of_birth', e.target.value)} className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">{isBn ? 'প্রোফাইল ছবি' : 'Profile Photo'}</label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-justice-gold hover:bg-justice-gold/5 transition overflow-hidden bg-gray-50"
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <FiCamera className="text-2xl text-gray-400" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>{isBn ? 'ছবি আপলোড করতে ক্লিক করুন' : 'Click to upload photo'}</p>
                    <p className="text-xs mt-1">JPG, PNG, WEBP (max 5MB)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-justice-navy mb-4">
              {isBn ? 'যোগাযোগের তথ্য' : 'Contact Information'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'ইমেইল' : 'Email'} *</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'ফোন' : 'Phone'} *</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'বর্তমান ঠিকানা' : 'Present Address'}</label>
                <input type="text" value={form.present_address} onChange={e => update('present_address', e.target.value)} className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-justice-navy mb-4">
              {isBn ? 'পেশাগত পটভূমি' : 'Professional Background'}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'শিক্ষা' : 'Education'}</label>
                <input
                  type="text"
                  placeholder={isBn ? 'কমা দিয়ে আলাদা করুন (যেমন: এলএলবি, এলএলএম)' : 'Comma separated (e.g. LLB, LLM)'}
                  value={form.education.join(', ')}
                  onChange={e => update('education', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'প্রশিক্ষণ' : 'Training'}</label>
                <input
                  type="text"
                  placeholder={isBn ? 'কমা দিয়ে আলাদা করুন' : 'Comma separated'}
                  value={form.training.join(', ')}
                  onChange={e => update('training', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'পুরস্কার' : 'Awards'}</label>
                <input
                  type="text"
                  placeholder={isBn ? 'কমা দিয়ে আলাদা করুন' : 'Comma separated'}
                  value={form.awards.join(', ')}
                  onChange={e => update('awards', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'জানা ভাষা' : 'Languages'}</label>
                <input
                  type="text"
                  placeholder={isBn ? 'কমা দিয়ে আলাদা করুন (যেমন: বাংলা, ইংরেজি)' : 'Comma separated (e.g. Bengali, English)'}
                  value={form.languages_known.join(', ')}
                  onChange={e => update('languages_known', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'অভিজ্ঞতার বছর' : 'Years of Experience'}</label>
                <input
                  type="number"
                  min="0"
                  max="70"
                  placeholder="0"
                  value={form.years_of_experience}
                  onChange={e => update('years_of_experience', parseInt(e.target.value) || 0)}
                  className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold"
                />
              </div>
            </div>
          </div>

          {role === 'police_officer' && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-justice-navy mb-4">
                {isBn ? 'পুলিশ অফিসার তথ্য' : 'Police Officer Information'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'ব্যাজ নম্বর' : 'Badge Number'} *</label>
                  <input type="text" value={form.badge_no} onChange={e => update('badge_no', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'পদবী' : 'Rank'} *</label>
                  <select value={form.rank} onChange={e => update('rank', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold">
                    <option value="">{isBn ? 'নির্বাচন করুন' : 'Select'}</option>
                    {['OC', 'SI', 'ASI', 'Constable', 'Inspector', 'Additional SP', 'SP', 'DIG', 'IGP'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {role === 'lawyer' && (
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-justice-navy mb-4">
                {isBn ? 'উকিল তথ্য' : 'Lawyer Information'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'বার কাউন্সিল নম্বর' : 'Bar Council Number'} *</label>
                  <input type="text" value={form.bar_council_no} onChange={e => update('bar_council_no', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'উকিলের ধরন' : 'Lawyer Type'} *</label>
                  <select value={form.lawyer_type} onChange={e => update('lawyer_type', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold">
                    <option value="">{isBn ? 'নির্বাচন করুন' : 'Select'}</option>
                    <option value="government">{isBn ? 'সরকারি' : 'Government'}</option>
                    <option value="private">{isBn ? 'বেসরকারি' : 'Private'}</option>
                    <option value="both">{isBn ? 'উভয়' : 'Both'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'আইন ফার্ম' : 'Law Firm'}</label>
                  <input type="text" value={form.law_firm} onChange={e => update('law_firm', e.target.value)} className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'অফিস ঠিকানা' : 'Office Address'}</label>
                  <input type="text" value={form.office_address} onChange={e => update('office_address', e.target.value)} className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? ' specialization' : 'Specialization'}</label>
                  <input
                    type="text"
                    placeholder={isBn ? 'কমা দিয়ে আলাদা করুন (যেমন: ফৌজদারি, দেওয়ানি)' : 'Comma separated (e.g. Criminal, Civil)'}
                    value={form.specialization.join(', ')}
                    onChange={e => update('specialization', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold"
                  />
                </div>
              </div>
            </div>
          )}

          {role === 'judge' && (
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-justice-navy mb-4">
                {isBn ? 'বিচারক তথ্য' : 'Judge Information'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'বিচারকের ধরন' : 'Judge Type'} *</label>
                  <select value={form.judge_type} onChange={e => update('judge_type', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold">
                    <option value="">{isBn ? 'নির্বাচন করুন' : 'Select'}</option>
                    {['District Judge', 'Sessions Judge', 'Magistrate', 'CMM', 'High Court Judge', 'Supreme Court Judge'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {role === 'magistrate' && (
            <div className="bg-yellow-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-justice-navy mb-4">
                {isBn ? 'ম্যাজিস্ট্রেট তথ্য' : 'Magistrate Information'}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'ম্যাজিস্ট্রেটের ধরন' : 'Magistrate Type'} *</label>
                  <select value={form.magistrate_type} onChange={e => update('magistrate_type', e.target.value)} required className="w-full h-12 px-4 border-2 border-gray-200 rounded-lg focus:border-justice-gold">
                    <option value="">{isBn ? 'নির্বাচন করুন' : 'Select'}</option>
                    {['Executive Magistrate', 'Judicial Magistrate', 'Metropolitan Magistrate'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-8 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              {isBn ? 'পেছনে' : 'Back'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-justice-gold text-white px-8 py-3 rounded-xl font-semibold hover:bg-justice-gold-dark transition disabled:opacity-50"
            >
              {submitting ? (isBn ? 'নিবন্ধন হচ্ছে...' : 'Submitting...') : (isBn ? 'নিবন্ধন জমা দিন' : 'Submit Registration')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
