import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUser, FiCalendar, FiMapPin, FiFileText, FiShield, FiArrowRight, FiBriefcase, FiUsers } from 'react-icons/fi';
import { criminalService } from '../../services/criminalService';
import { getPhotoUrl } from '../../services/api';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function CriminalProfile() {
  const { id } = useParams();
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [criminal, setCriminal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    criminalService.getById(id)
      .then(res => setCriminal(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Spinner size="lg" text={isBn ? 'প্রোফাইল লোড হচ্ছে...' : 'Loading profile...'} /></div>;
  if (!criminal) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiUser className="text-3xl text-court-red" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{isBn ? 'অপরাধী পাওয়া যায়নি' : 'Criminal Not Found'}</h2>
      </div>
    </div>
  );

  const displayName = isBn && criminal.name_bn ? criminal.name_bn : criminal.name;
  const displayFather = isBn && criminal.fatherName_bn ? criminal.fatherName_bn : criminal.fatherName;
  const displayMother = isBn && criminal.motherName_bn ? criminal.motherName_bn : criminal.motherName;
  const displayAddress = isBn && criminal.address_bn ? criminal.address_bn : criminal.address;

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-card border border-light-gray/60 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-justice-blue via-justice-blue-light to-justice-blue px-4 sm:px-8 py-6 sm:py-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white/20 shadow-xl flex-shrink-0">
                {criminal.photo ? (
                  <img src={getPhotoUrl(criminal.photo)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <FiUser className="text-3xl sm:text-5xl text-white/60" />
                )}
              </div>
              <div className="flex-1 pt-0 sm:pt-2">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2">{displayName}</h1>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      {criminal.nid && <span className="text-white/70 text-sm">NID: <span className="text-justice-gold font-bold">{criminal.nid}</span></span>}
                      <Badge variant={criminal.isRepeatOffender ? 'repeat' : 'active'} showIndicator>
                        {criminal.isRepeatOffender ? (isBn ? 'পুনরাবৃত্ত অপরাধী' : 'Repeat Offender') : (isBn ? 'প্রথমবার' : 'First Time')}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="bg-white/10 rounded-xl px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl font-extrabold text-justice-gold">{criminal.totalCases}</div>
                      <div className="text-xs text-white/70">{isBn ? 'মামলা' : 'Cases'}</div>
                    </div>
                    <div className="bg-white/10 rounded-xl px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl font-extrabold text-justice-gold">{criminal.totalBails}</div>
                      <div className="text-xs text-white/70">{isBn ? 'জামিন' : 'Bails'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-info-blue"><FiUser /></div>
                <div><p className="text-xs text-dark-gray">{isBn ? 'পিতার নাম' : "Father's Name"}</p><p className="font-semibold text-gray-900">{displayFather || '-'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500"><FiUser /></div>
                <div><p className="text-xs text-dark-gray">{isBn ? 'মাতার নাম' : "Mother's Name"}</p><p className="font-semibold text-gray-900">{displayMother || '-'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-success-green"><FiCalendar /></div>
                <div><p className="text-xs text-dark-gray">{isBn ? 'জন্ম তারিখ' : 'Date of Birth'}</p><p className="font-semibold text-gray-900">{criminal.dateOfBirth ? new Date(criminal.dateOfBirth).toLocaleDateString() : '-'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500"><FiBriefcase /></div>
                <div><p className="text-xs text-dark-gray">{isBn ? 'পেশা' : 'Occupation'}</p><p className="font-semibold text-gray-900">{criminal.occupation || '-'}</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Cases */}
            <Card title={isBn ? 'মামলার ইতিহাস' : 'Case History'} borderTop>
              {criminal.cases?.length > 0 ? (
                <div className="space-y-3">
                  {criminal.cases.map((c) => (
                    <Link key={c._id} to={`/case/${c._id}`} className="block p-4 rounded-xl border border-light-gray/60 hover:bg-off-white hover:border-justice-gold/30 transition-all group">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-justice-blue/5 flex items-center justify-center text-justice-blue group-hover:bg-justice-gold group-hover:text-white transition-all flex-shrink-0">
                            <FiFileText />
                          </div>
                          <div>
                            <span className="font-bold text-justice-blue group-hover:text-justice-gold transition-colors">{c.caseNumber}</span>
                            <p className="text-sm text-dark-gray mt-0.5">{c.sectionLaw}</p>
                            <div className="flex gap-3 mt-2 text-xs text-dark-gray">
                              <span>📅 {new Date(c.arrestDate).toLocaleDateString()}</span>
                              {c.thana && <span>📍 {c.thana.name}</span>}
                            </div>
                          </div>
                        </div>
                        <Badge variant={c.status} showIndicator>{isBn ? { pending: 'বিচারাধীন', trial: 'বিচার চলছে', disposed: 'নিষ্পত্তি', appealed: 'আপিল' }[c.status] || c.status : c.status}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-dark-gray text-sm text-center py-8">{isBn ? 'কোন মামলা নেই' : 'No cases found'}</p>
              )}
            </Card>

            {/* Bail Records */}
            <Card title={isBn ? 'জামিনের রেকর্ড' : 'Bail Records'} borderTop>
              {criminal.bailRecords?.length > 0 ? (
                <div className="space-y-3">
                  {criminal.bailRecords.map((b) => (
                    <div key={b._id} className="p-4 rounded-xl border border-light-gray/60 hover:bg-off-white transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-justice-gold flex-shrink-0"><FiShield /></div>
                          <div>
                            <span className="font-bold text-gray-900">{b.case?.caseNumber || '-'}</span>
                            <div className="flex flex-wrap gap-3 mt-1 text-xs text-dark-gray">
                              {b.lawyer && <span>⚖️ {isBn ? 'উকিল' : 'Lawyer'}: {b.lawyer.name}</span>}
                              {b.judge && <span>🏛️ {isBn ? 'বিচারক' : 'Judge'}: {b.judge.name}</span>}
                              <span>📅 {new Date(b.bailDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {b.bailAmount > 0 && <span className="font-bold text-success-green">৳{b.bailAmount.toLocaleString()}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-dark-gray text-sm text-center py-8">{isBn ? 'কোন জামিনের রেকর্ড নেই' : 'No bail records'}</p>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card title={isBn ? 'ঠিকানা' : 'Address'} className="sticky top-24">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-justice-gold mt-1 flex-shrink-0" />
                <p className="text-sm text-gray-700">{displayAddress || (isBn ? 'কোন ঠিকানা নেই' : 'No address provided')}</p>
              </div>
              {criminal.district && (
                <div className="mt-4 pt-4 border-t border-light-gray/60">
                  <p className="text-xs text-dark-gray">{isBn ? 'জেলা' : 'District'}</p>
                  <p className="font-semibold text-gray-900">{isBn && criminal.district.name_bn ? criminal.district.name_bn : criminal.district.name}</p>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-light-gray/60">
                <p className="text-xs text-dark-gray">{isBn ? 'লিঙ্গ' : 'Gender'}</p>
                <p className="font-semibold text-gray-900 capitalize">{criminal.gender}</p>
              </div>
              <Link to={`/search?q=${criminal.nid || criminal.name}`}>
                <Button variant="outline" size="sm" className="w-full mt-4">{isBn ? 'সব মামলা দেখুন' : 'View All Cases'} <FiArrowRight /></Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
