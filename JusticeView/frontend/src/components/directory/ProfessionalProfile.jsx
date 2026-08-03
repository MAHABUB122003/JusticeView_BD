import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUser, FiMail, FiPhone, FiMapPin, FiBookOpen, FiAward, FiBriefcase, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import { professionalService } from '../../services/professionalService';
import ProfessionalProfileHeader from './ProfessionalProfileHeader';
import ProfessionalStats from './ProfessionalStats';
import CaseHistoryTab from './CaseHistoryTab';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import toast from 'react-hot-toast';

export default function ProfessionalProfile() {
  const { id } = useParams();
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [professional, setProfessional] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    professionalService.getById(id)
      .then(res => setProfessional(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const startEdit = () => {
    setEditForm({
      education: professional.education?.join(', ') || '',
      training: professional.training?.join(', ') || '',
      awards: professional.awards?.join(', ') || '',
      languages_known: professional.languages_known?.join(', ') || '',
      years_of_experience: professional.years_of_experience || 0,
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditForm({});
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const updateData = {
        education: editForm.education.split(',').map(s => s.trim()).filter(Boolean),
        training: editForm.training.split(',').map(s => s.trim()).filter(Boolean),
        awards: editForm.awards.split(',').map(s => s.trim()).filter(Boolean),
        languages_known: editForm.languages_known.split(',').map(s => s.trim()).filter(Boolean),
        years_of_experience: parseInt(editForm.years_of_experience) || 0,
      };
      const res = await professionalService.update(id, updateData);
      setProfessional(prev => ({ ...prev, ...res.data.data }));
      toast.success(isBn ? 'হালনাগাদ করা হয়েছে!' : 'Updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || (isBn ? 'হালনাগাদ ব্যর্থ' : 'Update failed'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-off-white pt-24 flex items-center justify-center">
      <Spinner size="lg" text={isBn ? 'প্রোফাইল লোড হচ্ছে...' : 'Loading profile...'} />
    </div>
  );

  if (!professional) return (
    <div className="min-h-screen bg-off-white pt-24 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiUser className="text-3xl text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{isBn ? 'প্রফেশনাল পাওয়া যায়নি' : 'Professional Not Found'}</h2>
        <Link to="/directory" className="text-justice-gold hover:underline mt-2 inline-block">
          {isBn ? 'ডিরেক্টরিতে ফিরে যান' : 'Back to Directory'}
        </Link>
      </div>
    </div>
  );

  const displayAddress = isBn && professional.bn_present_address ? professional.bn_present_address : professional.present_address;
  const displayPermanent = isBn && professional.bn_permanent_address ? professional.bn_permanent_address : professional.permanent_address;

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-sm text-gray-500">
          <Link to="/directory" className="text-justice-gold hover:underline">{isBn ? 'ডিরেক্টরি' : 'Directory'}</Link>
          {' / '}
          <span className="text-gray-900">{isBn && professional.bn_name ? professional.bn_name : professional.name}</span>
        </div>

        <ProfessionalProfileHeader professional={professional} />
        <ProfessionalStats stats={professional} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-justice-navy mb-4">
                {isBn ? 'মামলার ইতিহাস' : 'Case History'}
              </h2>
              <CaseHistoryTab cases={professional.caseHistories || []} />
            </div>

            <Card
              title={isBn ? 'বিস্তারিত তথ্য' : 'Detailed Information'}
              borderTop
              headerRight={
                !editing ? (
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1 text-sm text-justice-gold hover:text-justice-gold-dark font-medium"
                  >
                    <FiEdit3 /> {isBn ? 'সম্পাদনা' : 'Edit'}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      disabled={saving}
                      className="flex items-center gap-1 text-sm bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 disabled:opacity-50"
                    >
                      <FiSave /> {saving ? (isBn ? 'সেভ হচ্ছে...' : 'Saving...') : (isBn ? 'সেভ' : 'Save')}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                    >
                      <FiX /> {isBn ? 'বাতিল' : 'Cancel'}
                    </button>
                  </div>
                )
              }
            >
              {editing ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'শিক্ষা' : 'Education'}</label>
                    <input
                      type="text"
                      value={editForm.education}
                      onChange={e => handleEditChange('education', e.target.value)}
                      placeholder={isBn ? 'কমা দিয়ে আলাদা করুন' : 'Comma separated'}
                      className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-justice-gold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'প্রশিক্ষণ' : 'Training'}</label>
                    <input
                      type="text"
                      value={editForm.training}
                      onChange={e => handleEditChange('training', e.target.value)}
                      placeholder={isBn ? 'কমা দিয়ে আলাদা করুন' : 'Comma separated'}
                      className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-justice-gold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'পুরস্কার' : 'Awards'}</label>
                    <input
                      type="text"
                      value={editForm.awards}
                      onChange={e => handleEditChange('awards', e.target.value)}
                      placeholder={isBn ? 'কমা দিয়ে আলাদা করুন' : 'Comma separated'}
                      className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-justice-gold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'জানা ভাষা' : 'Languages'}</label>
                    <input
                      type="text"
                      value={editForm.languages_known}
                      onChange={e => handleEditChange('languages_known', e.target.value)}
                      placeholder={isBn ? 'কমা দিয়ে আলাদা করুন' : 'Comma separated'}
                      className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-justice-gold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{isBn ? 'অভিজ্ঞতার বছর' : 'Years of Experience'}</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.years_of_experience}
                      onChange={e => handleEditChange('years_of_experience', e.target.value)}
                      className="w-full h-10 px-3 border-2 border-gray-200 rounded-lg focus:border-justice-gold text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">{isBn ? 'শিক্ষা' : 'Education'}</h4>
                    {professional.education?.length > 0 ? (
                      <ul className="space-y-2">
                        {professional.education.map((e, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <FiBookOpen className="text-justice-gold flex-shrink-0" /> {e}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">{isBn ? 'কোন তথ্য নেই' : 'No information'}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">{isBn ? 'প্রশিক্ষণ' : 'Training'}</h4>
                    {professional.training?.length > 0 ? (
                      <ul className="space-y-2">
                        {professional.training.map((t, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <FiBriefcase className="text-justice-gold flex-shrink-0" /> {t}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">{isBn ? 'কোন তথ্য নেই' : 'No information'}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">{isBn ? 'পুরস্কার' : 'Awards'}</h4>
                    {professional.awards?.length > 0 ? (
                      <ul className="space-y-2">
                        {professional.awards.map((a, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                            <FiAward className="text-justice-gold flex-shrink-0" /> {a}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400">{isBn ? 'কোন তথ্য নেই' : 'No information'}</p>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">{isBn ? 'ভাষা' : 'Languages'}</h4>
                    {professional.languages_known?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {professional.languages_known.map((l, i) => (
                          <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">{l}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">{isBn ? 'কোন তথ্য নেই' : 'No information'}</p>
                    )}
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card title={isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Info'} className="sticky top-24">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiUser className="text-justice-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{isBn ? 'এনআইডি' : 'NID'}</p>
                    <p className="font-semibold text-gray-900">{professional.nid || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMail className="text-justice-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{isBn ? 'ইমেইল' : 'Email'}</p>
                    <p className="font-semibold text-gray-900">{professional.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiPhone className="text-justice-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{isBn ? 'ফোন' : 'Phone'}</p>
                    <p className="font-semibold text-gray-900">{professional.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-justice-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">{isBn ? 'বর্তমান ঠিকানা' : 'Present Address'}</p>
                    <p className="font-semibold text-gray-900">{displayAddress || '-'}</p>
                  </div>
                </div>
                {displayPermanent && (
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-justice-gold mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">{isBn ? 'স্থায়ী ঠিকানা' : 'Permanent Address'}</p>
                      <p className="font-semibold text-gray-900">{displayPermanent}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
