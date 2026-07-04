import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiFileText, FiUser, FiMapPin, FiCalendar, FiClock, FiShield, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import { caseService } from '../../services/caseService';
import { getPhotoUrl } from '../../services/api';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import Button from '../ui/Button';

export default function CaseDetail() {
  const { id } = useParams();
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    caseService.getById(id)
      .then(res => setCaseData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Spinner size="lg" text={isBn ? 'মামলার তথ্য লোড হচ্ছে...' : 'Loading case details...'} /></div>;
  if (!caseData) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiFileText className="text-3xl text-court-red" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{isBn ? 'মামলা পাওয়া যায়নি' : 'Case Not Found'}</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-card border border-light-gray/60 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-justice-blue via-justice-blue-light to-justice-blue px-4 sm:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-xl sm:text-2xl text-justice-gold" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white">{caseData.caseNumber}</h1>
                  <p className="text-white/70 text-xs sm:text-sm">{caseData.sectionLaw}</p>
                </div>
              </div>
              <Badge variant={caseData.status} showIndicator>
                {isBn ? { pending: 'বিচারাধীন', trial: 'বিচার চলছে', disposed: 'নিষ্পত্তি', appealed: 'আপিল' }[caseData.status] || caseData.status : caseData.status}
              </Badge>
            </div>
          </div>

          <div className="px-8 py-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-court-red"><FiCalendar /></div>
                <div><p className="text-xs text-dark-gray">{isBn ? 'গ্রেফতার তারিখ' : 'Arrest Date'}</p><p className="font-semibold">{new Date(caseData.arrestDate).toLocaleDateString()}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-info-blue"><FiClock /></div>
                <div><p className="text-xs text-dark-gray">{isBn ? 'সময়' : 'Time'}</p><p className="font-semibold">{caseData.arrestTime || '-'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-justice-gold"><FiCalendar /></div>
                <div><p className="text-xs text-dark-gray">{isBn ? 'আদালতে প্রেরণ' : 'Court Sent'}</p><p className="font-semibold">{caseData.courtSentDate ? new Date(caseData.courtSentDate).toLocaleDateString() : '-'}</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-success-green"><FiShield /></div>
                <div><p className="text-xs text-dark-gray">{isBn ? 'অগ্রাধিকার' : 'Priority'}</p><Badge variant={caseData.priority}>{caseData.priority}</Badge></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card title={isBn ? 'মামলার বিবরণ' : 'Case Description'} borderTop>
              <p className="text-gray-700 leading-relaxed">
                {isBn && caseData.description_bn ? caseData.description_bn : caseData.description || (isBn ? 'কোন বিবরণ নেই' : 'No description provided')}
              </p>
            </Card>

            {/* Bail Records */}
            <Card title={isBn ? 'জামিনের রেকর্ড' : 'Bail Records'} borderTop>
              {caseData.bailRecords?.length > 0 ? (
                <div className="space-y-3">
                  {caseData.bailRecords.map((b) => (
                    <div key={b._id} className="p-4 rounded-xl border border-light-gray/60 hover:bg-off-white transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-justice-gold flex-shrink-0"><FiBookOpen /></div>
                          <div>
                            <span className="font-bold text-gray-900">{new Date(b.bailDate).toLocaleDateString()}</span>
                            <div className="flex flex-wrap gap-3 mt-1 text-xs text-dark-gray">
                              {b.lawyer && <span>⚖️ {isBn ? 'উকিল' : 'Lawyer'}: <span className="font-medium">{b.lawyer.name}</span></span>}
                              {b.judge && <span>🏛️ {isBn ? 'বিচারক' : 'Judge'}: <span className="font-medium">{b.judge.name}</span></span>}
                              {b.nextHearingDate && <span>📅 {isBn ? 'পরবর্তী শুনানি' : 'Next Hearing'}: {new Date(b.nextHearingDate).toLocaleDateString()}</span>}
                            </div>
                          </div>
                        </div>
                        {b.bailAmount > 0 && <span className="font-bold text-success-green text-lg">৳{b.bailAmount.toLocaleString()}</span>}
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
            <Card title={isBn ? 'অপরাধী' : 'Criminal'} className="sticky top-24">
              {caseData.criminal ? (
                <Link to={`/criminal/${caseData.criminal._id}`} className="flex items-center gap-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {caseData.criminal.photo ? (
                      <img src={getPhotoUrl(caseData.criminal.photo)} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FiUser className="text-2xl text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-justice-blue group-hover:text-justice-gold transition-colors">
                      {isBn && caseData.criminal.name_bn ? caseData.criminal.name_bn : caseData.criminal.name}
                    </p>
                    <p className="text-xs text-dark-gray">NID: {caseData.criminal.nid || '-'}</p>
                  </div>
                  <FiArrowRight className="text-gray-300 group-hover:text-justice-gold transition-colors" />
                </Link>
              ) : <p className="text-dark-gray text-sm">-</p>}
            </Card>

            <Card title={isBn ? 'থানা' : 'Thana'}>
              {caseData.thana ? (
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-justice-gold mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{caseData.thana.name}</p>
                    {caseData.thana.phone && <p className="text-xs text-dark-gray">📞 {caseData.thana.phone}</p>}
                  </div>
                </div>
              ) : <p className="text-dark-gray text-sm">-</p>}
            </Card>

            <Card title={isBn ? 'আদালত' : 'Court'}>
              {caseData.court ? (
                <div>
                  <p className="font-semibold text-gray-900">{caseData.court.name}</p>
                  <p className="text-xs text-dark-gray mt-1">{caseData.court.address}</p>
                </div>
              ) : <p className="text-dark-gray text-sm">{isBn ? 'আদালত নির্ধারিত হয়নি' : 'Court not assigned'}</p>}
            </Card>

            <Card title={isBn ? 'গ্রেফতারকারী অফিসার' : 'Arresting Officer'}>
              {caseData.arrestingOfficer ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-justice-blue/10 flex items-center justify-center text-justice-blue flex-shrink-0"><FiShield /></div>
                  <div>
                    <p className="font-semibold text-gray-900">{caseData.arrestingOfficer.name}</p>
                    <p className="text-xs text-dark-gray">{caseData.arrestingOfficer.designation} • {caseData.arrestingOfficer.badgeNumber}</p>
                  </div>
                </div>
              ) : <p className="text-dark-gray text-sm">-</p>}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
