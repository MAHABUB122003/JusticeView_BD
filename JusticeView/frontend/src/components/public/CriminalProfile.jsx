import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUser, FiCalendar, FiMapPin, FiFileText, FiShield, FiArrowRight, FiBriefcase, FiUsers, FiMail, FiPhone, FiDroplet, FiGlobe, FiBook, FiFlag, FiGrid, FiCamera, FiLock, FiInfo } from 'react-icons/fi';
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
  const [activeTab, setActiveTab] = useState('overview');

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
  const displayPresentAddr = isBn && criminal.presentAddress_bn ? criminal.presentAddress_bn : (criminal.presentAddress || criminal.address);
  const displayPermanentAddr = isBn && criminal.permanentAddress_bn ? criminal.permanentAddress_bn : criminal.permanentAddress;

  const tabs = [
    { key: 'overview', label: isBn ? 'ওভারভিউ' : 'Overview' },
    { key: 'cases', label: isBn ? 'মামলা' : 'Cases' },
    { key: 'judgments', label: isBn ? 'রায়' : 'Judgments' },
    { key: 'punishments', label: isBn ? 'শাস্তি' : 'Punishments' },
    { key: 'bails', label: isBn ? 'জামিন' : 'Bails' },
    { key: 'hearings', label: isBn ? 'শুনানি' : 'Hearings' },
    { key: 'evidence', label: isBn ? 'প্রমাণ' : 'Evidence' },
  ];

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-card border border-light-gray/60 overflow-hidden mb-6">
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
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1">{displayName}</h1>
                    <p className="text-white/60 text-sm mb-2">{criminal.criminalId || criminal._id}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                      {criminal.nid && <span className="text-white/70 text-sm">NID: <span className="text-justice-gold font-bold">{criminal.nid}</span></span>}
                      <Badge variant={criminal.isRepeatOffender ? 'repeat' : 'active'} showIndicator>
                        {criminal.isRepeatOffender ? (isBn ? 'পুনরাবৃত্ত অপরাধী' : 'Repeat Offender') : (isBn ? 'প্রথমবার' : 'First Time')}
                      </Badge>
                      <Badge variant={criminal.isActive ? 'active' : 'inactive'} showIndicator>
                        {criminal.isActive ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')}
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
                    <div className="bg-white/10 rounded-xl px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm">
                      <div className="text-xl sm:text-2xl font-extrabold text-justice-gold">{criminal.totalConvictions || 0}</div>
                      <div className="text-xs text-white/70">{isBn ? 'দণ্ড' : 'Convictions'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem icon={<FiUser />} label={isBn ? 'পিতার নাম' : "Father's Name"} value={displayFather || '-'} color="blue" />
              <InfoItem icon={<FiUser />} label={isBn ? 'মাতার নাম' : "Mother's Name"} value={displayMother || '-'} color="pink" />
              <InfoItem icon={<FiCalendar />} label={isBn ? 'জন্ম তারিখ' : 'Date of Birth'} value={criminal.dateOfBirth ? new Date(criminal.dateOfBirth).toLocaleDateString() : '-'} color="green" />
              <InfoItem icon={<FiCalendar />} label={isBn ? 'বয়স' : 'Age'} value={criminal.age != null ? `${criminal.age}` : '-'} color="purple" />
              <InfoItem icon={<FiDroplet />} label={isBn ? 'রক্তের গ্রুপ' : 'Blood Group'} value={criminal.bloodGroup || '-'} color="red" />
              <InfoItem icon={<FiGlobe />} label={isBn ? 'ধর্ম' : 'Religion'} value={criminal.religion || '-'} color="indigo" />
              <InfoItem icon={<FiFlag />} label={isBn ? 'জাতীয়তা' : 'Nationality'} value={criminal.nationality || (isBn ? 'বাংলাদেশী' : 'Bangladeshi')} color="teal" />
              <InfoItem icon={<FiBook />} label={isBn ? 'পাসপোর্ট' : 'Passport'} value={criminal.passportNo || '-'} color="amber" />
              <InfoItem icon={<FiBriefcase />} label={isBn ? 'পেশা' : 'Occupation'} value={criminal.occupation || '-'} color="purple" />
              <InfoItem icon={criminal.gender === 'male' ? <FiUser /> : <FiUser />} label={isBn ? 'লিঙ্গ' : 'Gender'} value={isBn ? { male: 'পুরুষ', female: 'মহিলা', other: 'অন্যান্য' }[criminal.gender] || criminal.gender : criminal.gender} color="cyan" />
              <InfoItem icon={<FiPhone />} label={isBn ? 'মোবাইল' : 'Contact'} value={criminal.contactNo || '-'} color="green" />
              <InfoItem icon={<FiMail />} label="Email" value={criminal.email || '-'} color="blue" />
            </div>
            {criminal.biometricId && (
              <div className="mt-4 pt-4 border-t border-light-gray/60 flex flex-wrap gap-6 text-sm">
                <span className="text-dark-gray">{isBn ? 'বায়োমেট্রিক আইডি' : 'Biometric ID'}: <strong className="text-gray-900">{criminal.biometricId}</strong></span>
                {criminal.fingerprintData && <span className="text-dark-gray">{isBn ? 'ফিঙ্গারপ্রিন্ট' : 'Fingerprint'}: <strong className="text-gray-900">{isBn ? 'উপলব্ধ' : 'Available'}</strong></span>}
              </div>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card title={isBn ? 'বর্তমান ঠিকানা' : 'Present Address'} borderTop>
            <div className="flex items-start gap-3">
              <FiMapPin className="text-justice-gold mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">{displayPresentAddr || (isBn ? 'কোন ঠিকানা নেই' : 'No address provided')}</p>
            </div>
            {criminal.district && (
              <div className="mt-3 pt-3 border-t border-light-gray/60">
                <p className="text-xs text-dark-gray">{isBn ? 'জেলা' : 'District'}</p>
                <p className="font-semibold text-gray-900">{isBn && criminal.district.name_bn ? criminal.district.name_bn : criminal.district.name}</p>
              </div>
            )}
          </Card>
          <Card title={isBn ? 'স্থায়ী ঠিকানা' : 'Permanent Address'} borderTop>
            <div className="flex items-start gap-3">
              <FiMapPin className="text-justice-gold mt-1 flex-shrink-0" />
              <p className="text-sm text-gray-700">{displayPermanentAddr || displayPresentAddr || (isBn ? 'কোন ঠিকানা নেই' : 'No address provided')}</p>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-card border border-light-gray/60 overflow-hidden mb-8">
          <div className="border-b border-light-gray/60 overflow-x-auto">
            <div className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.key
                      ? 'border-justice-gold text-justice-gold'
                      : 'border-transparent text-dark-gray hover:text-justice-blue hover:border-justice-blue/30'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 sm:p-8 min-h-[300px]">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">{isBn ? 'ব্যক্তিগত তথ্য' : 'Personal Info'}</h4>
                  <div className="space-y-2 text-sm">
                    <Row label={isBn ? 'ক্রিমিনাল আইডি' : 'Criminal ID'} value={criminal.criminalId || criminal._id} />
                    <Row label={isBn ? 'জাতীয়তা' : 'Nationality'} value={criminal.nationality || 'Bangladeshi'} />
                    <Row label={isBn ? 'ধর্ম' : 'Religion'} value={criminal.religion || '-'} />
                    <Row label={isBn ? 'রক্তের গ্রুপ' : 'Blood Group'} value={criminal.bloodGroup || '-'} />
                    <Row label={isBn ? 'পাসপোর্ট নং' : 'Passport No'} value={criminal.passportNo || '-'} />
                    <Row label={isBn ? 'মোট দণ্ড' : 'Total Convictions'} value={criminal.totalConvictions || 0} />
                    <Row label={isBn ? 'অবস্থা' : 'Status'} value={criminal.isActive ? (isBn ? 'সক্রিয়' : 'Active') : (isBn ? 'নিষ্ক্রিয়' : 'Inactive')} />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">{isBn ? 'যোগাযোগ' : 'Contact'}</h4>
                  <div className="space-y-2 text-sm">
                    <Row label={isBn ? 'মোবাইল' : 'Mobile'} value={criminal.contactNo || '-'} />
                    <Row label="Email" value={criminal.email || '-'} />
                  </div>
                  <h4 className="font-bold text-gray-900 mt-6 mb-3">{isBn ? 'জৈবিক তথ্য' : 'Biometric Info'}</h4>
                  <div className="space-y-2 text-sm">
                    <Row label={isBn ? 'বায়োমেট্রিক আইডি' : 'Biometric ID'} value={criminal.biometricId || '-'} />
                    <Row label={isBn ? 'ফিঙ্গারপ্রিন্ট' : 'Fingerprint'} value={criminal.fingerprintData ? (isBn ? 'উপলব্ধ' : 'Available') : '-'} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cases' && (
              <div>
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
                              <p className="text-sm text-dark-gray mt-0.5">{c.sectionLaw || c.lawSection}</p>
                              <div className="flex gap-3 mt-2 text-xs text-dark-gray">
                                {c.arrestDate && <span>{new Date(c.arrestDate).toLocaleDateString()}</span>}
                                {c.thana && <span>{c.thana.name}</span>}
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
              </div>
            )}

            {activeTab === 'judgments' && (
              <div>
                {criminal.judgments?.length > 0 ? (
                  <div className="space-y-3">
                    {criminal.judgments.map((j) => (
                      <div key={j._id} className="p-4 rounded-xl border border-light-gray/60">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-court-red flex-shrink-0"><FiFileText /></div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-bold text-gray-900">{isBn ? 'রায়' : 'Judgment'} #{j.judgmentNumber || j._id}</span>
                              <Badge variant={j.status}>{j.status}</Badge>
                            </div>
                            <p className="text-xs text-dark-gray mt-1">{j.caseNumber}</p>
                            {j.judgeName && <p className="text-xs mt-1">{isBn ? 'বিচারক' : 'Judge'}: {j.judgeName}</p>}
                            {j.judgmentDate && <p className="text-xs mt-1">{new Date(j.judgmentDate).toLocaleDateString()}</p>}
                            {j.summary && <p className="text-sm mt-2 text-gray-600 line-clamp-2">{j.summary}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-gray text-sm text-center py-8">{isBn ? 'কোন রায় নেই' : 'No judgments found'}</p>
                )}
              </div>
            )}

            {activeTab === 'punishments' && (
              <div>
                {criminal.punishments?.length > 0 ? (
                  <div className="space-y-3">
                    {criminal.punishments.map((p) => (
                      <div key={p._id} className="p-4 rounded-xl border border-light-gray/60">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-court-red flex-shrink-0"><FiShield /></div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-bold text-gray-900">{isBn ? 'শাস্তি' : 'Punishment'} #{p.punishmentNumber || p._id}</span>
                            </div>
                            <p className="text-sm mt-1">{isBn && p.punishmentType_bn ? p.punishmentType_bn : p.punishmentType}</p>
                            {p.duration && <p className="text-xs text-dark-gray">{isBn ? 'মেয়াদ' : 'Duration'}: {p.duration}</p>}
                            {p.fineAmount > 0 && <p className="text-xs text-dark-gray">{isBn ? 'জরিমানা' : 'Fine'}: ৳{p.fineAmount.toLocaleString()}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-gray text-sm text-center py-8">{isBn ? 'কোন শাস্তি নেই' : 'No punishments found'}</p>
                )}
              </div>
            )}

            {activeTab === 'bails' && (
              <div>
                {criminal.bailRecords?.length > 0 ? (
                  <div className="space-y-3">
                    {criminal.bailRecords.map((b) => (
                      <div key={b._id} className="p-4 rounded-xl border border-light-gray/60 hover:bg-off-white transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-justice-gold flex-shrink-0"><FiShield /></div>
                            <div>
                              <span className="font-bold text-gray-900">{b.bailId || 'Bail #' + b._id.slice(-6)}</span>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-dark-gray">
                                {b.lawyer && <span>{isBn ? 'উকিল' : 'Lawyer'}: {b.lawyer.name}</span>}
                                {b.applicationDate && <span>{new Date(b.applicationDate).toLocaleDateString()}</span>}
                                <Badge variant={b.status || b.applicationType} size="sm">{b.status || b.applicationType}</Badge>
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
              </div>
            )}

            {activeTab === 'hearings' && (
              <div>
                {criminal.hearings?.length > 0 ? (
                  <div className="space-y-3">
                    {criminal.hearings.map((h) => (
                      <div key={h._id} className="p-4 rounded-xl border border-light-gray/60">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-info-blue flex-shrink-0"><FiCalendar /></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-gray-900">{isBn ? 'শুনানি' : 'Hearing'} #{h.hearingNumber || h._id.slice(-6)}</span>
                                <p className="text-xs text-dark-gray">{h.caseNumber}</p>
                              </div>
                              <Badge variant={h.status || h.hearingType}>{h.status || h.hearingType}</Badge>
                            </div>
                            {h.hearingDate && <p className="text-sm mt-2">{new Date(h.hearingDate).toLocaleDateString()}</p>}
                            {h.notes && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{h.notes}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-gray text-sm text-center py-8">{isBn ? 'কোন শুনানি নেই' : 'No hearings found'}</p>
                )}
              </div>
            )}

            {activeTab === 'evidence' && (
              <div>
                {criminal.evidence?.length > 0 ? (
                  <div className="space-y-3">
                    {criminal.evidence.map((e) => (
                      <div key={e._id} className="p-4 rounded-xl border border-light-gray/60">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-success-green flex-shrink-0"><FiGrid /></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-gray-900">{e.evidenceNumber || e._id.slice(-6)}</span>
                                <p className="text-sm text-gray-700">{isBn && e.evidenceType_bn ? e.evidenceType_bn : e.evidenceType}</p>
                              </div>
                              <Badge variant={e.status}>{e.status}</Badge>
                            </div>
                            {e.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{e.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-gray text-sm text-center py-8">{isBn ? 'কোন প্রমাণ নেই' : 'No evidence records'}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-info-blue',
    pink: 'bg-pink-50 text-pink-500',
    green: 'bg-green-50 text-success-green',
    purple: 'bg-purple-50 text-purple-500',
    red: 'bg-red-50 text-court-red',
    indigo: 'bg-indigo-50 text-indigo-500',
    teal: 'bg-teal-50 text-teal-500',
    amber: 'bg-amber-50 text-amber-600',
    cyan: 'bg-cyan-50 text-cyan-600',
  };
  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[color] || colors.blue}`}>{icon}</div>
      <div>
        <p className="text-xs text-dark-gray">{label}</p>
        <p className="font-semibold text-gray-900 text-sm">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-light-gray/40">
      <span className="text-dark-gray">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
