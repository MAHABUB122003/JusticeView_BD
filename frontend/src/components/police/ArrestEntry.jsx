import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FiUser, FiSave, FiUpload, FiShield, FiCamera, FiArrowRight, FiUsers } from 'react-icons/fi';
import { criminalService } from '../../services/criminalService';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function ArrestEntry() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [form, setForm] = useState({
    name: '', name_bn: '', nid: '', fatherName: '', fatherName_bn: '',
    motherName: '', motherName_bn: '', address: '', address_bn: '',
    gender: 'male', occupation: '', dateOfBirth: '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [createdCriminal, setCreatedCriminal] = useState(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setCreatedCriminal(null);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (photo) formData.append('photo', photo);
      const res = await criminalService.create(formData);
      const criminal = res.data.data;
      setCreatedCriminal(criminal);
      setMessage(isBn
        ? `গ্রেফতার সফলভাবে রেকর্ড করা হয়েছে। Criminal ID: ${criminal._id}`
        : `Arrest recorded successfully. Criminal ID: ${criminal._id}`);
      setForm({ name: '', name_bn: '', nid: '', fatherName: '', fatherName_bn: '', motherName: '', motherName_bn: '', address: '', address_bn: '', gender: 'male', occupation: '', dateOfBirth: '' });
      setPhoto(null);
      setPhotoPreview(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-justice-blue to-justice-blue-light rounded-2xl flex items-center justify-center shadow-lg">
            <FiShield className="text-2xl text-justice-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'নতুন গ্রেফতার এন্ট্রি' : 'New Arrest Entry'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'অপরাধীর সম্পূর্ণ তথ্য রেকর্ড করুন' : 'Record complete criminal information'}</p>
          </div>
        </div>

        <Card>
          {message && (
            <div className={`px-5 py-4 rounded-xl mb-6 text-sm flex items-center gap-2 border ${message.includes('successfully') || message.includes('সফলভাবে') ? 'bg-green-50 border-green-200 text-success-green' : 'bg-red-50 border-red-200 text-court-red'}`}>
              {message.includes('successfully') || message.includes('সফলভাবে') ? '✓' : '⚠'} {message}
            </div>
          )}

          {createdCriminal && (
            <div className="bg-justice-blue/5 border border-justice-blue/20 rounded-xl p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-justice-blue mb-1">
                    {isBn ? 'অপরাধী আইডি (মামলা তৈরি করতে কপি করুন)' : 'Criminal ID (copy for Case Entry)'}
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="text-lg font-mono font-bold text-justice-gold bg-white px-4 py-2 rounded-lg border border-justice-gold/30 select-all cursor-pointer"
                      onClick={() => navigator.clipboard.writeText(createdCriminal._id)}>
                      {createdCriminal._id}
                    </code>
                    <span className="text-xs text-dark-gray">{isBn ? 'ক্লিক করে কপি করুন' : 'click to copy'}</span>
                  </div>
                </div>
                <Link to={`/police/case?criminalId=${createdCriminal._id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-justice-gold text-white rounded-xl font-bold text-sm hover:bg-justice-gold-dark transition-all shadow-md whitespace-nowrap">
                  <FiArrowRight /> {isBn ? 'মামলা তৈরি করুন' : 'Create Case'}
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Upload */}
            <div className="flex flex-col items-center p-8 border-2 border-dashed border-light-gray rounded-2xl hover:border-justice-gold/50 transition-all bg-gray-50/50">
              {photoPreview ? (
                <div className="relative">
                  <img src={photoPreview} alt="Preview" className="w-32 h-32 rounded-2xl object-cover shadow-lg" />
                  <button type="button" onClick={() => { setPhoto(null); setPhotoPreview(null); }} className="absolute -top-2 -right-2 w-7 h-7 bg-court-red text-white rounded-full text-xs font-bold hover:bg-court-red-dark">✕</button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCamera className="text-2xl text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">{isBn ? 'অপরাধীর ছবি আপলোড করুন' : 'Upload Criminal Photo'}</p>
                  <p className="text-xs text-dark-gray mt-1">JPG, PNG, WEBP (Max 5MB)</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" id="photo-upload" />
              <div className="mt-4">
                <Button type="button" variant="outline" size="sm" icon={<FiUpload />}
                  onClick={() => document.getElementById('photo-upload').click()}>
                  {photoPreview ? (isBn ? 'পরিবর্তন' : 'Change') : (isBn ? 'ছবি নির্বাচন' : 'Select Photo')}
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'নাম (ইংরেজি)' : 'Name (English)'} *</label>
                <div className="relative"><FiUser className="absolute left-4 top-4 text-gray-400" />
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'নাম (বাংলা)' : 'Name (Bengali)'}</label>
                <input type="text" name="name_bn" value={form.name_bn} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">NID</label>
                <input type="text" name="nid" value={form.nid} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'পিতার নাম (ইংরেজি)' : "Father's Name (English)"}</label>
                <input type="text" name="fatherName" value={form.fatherName} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'পিতার নাম (বাংলা)' : "Father's Name (Bengali)"}</label>
                <input type="text" name="fatherName_bn" value={form.fatherName_bn} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'মাতার নাম (ইংরেজি)' : "Mother's Name (English)"}</label>
                <input type="text" name="motherName" value={form.motherName} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'মাতার নাম (বাংলা)' : "Mother's Name (Bengali)"}</label>
                <input type="text" name="motherName_bn" value={form.motherName_bn} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'লিঙ্গ' : 'Gender'}</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white appearance-none cursor-pointer">
                  <option value="male">{isBn ? 'পুরুষ' : 'Male'}</option>
                  <option value="female">{isBn ? 'মহিলা' : 'Female'}</option>
                  <option value="other">{isBn ? 'অন্যান্য' : 'Other'}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'জন্ম তারিখ' : 'Date of Birth'}</label>
                <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'পেশা' : 'Occupation'}</label>
                <input type="text" name="occupation" value={form.occupation} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'ঠিকানা (ইংরেজি)' : 'Address (English)'}</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'ঠিকানা (বাংলা)' : 'Address (Bengali)'}</label>
              <input type="text" name="address_bn" value={form.address_bn} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
            </div>

            <Button type="submit" loading={loading} variant="primary" size="lg" className="w-full" icon={<FiSave />}>
              {isBn ? 'গ্রেফতার রেকর্ড করুন' : 'Record Arrest'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
