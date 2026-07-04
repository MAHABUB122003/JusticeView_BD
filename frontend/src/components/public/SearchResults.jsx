import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiUsers, FiFileText, FiSearch, FiFilter, FiArrowRight } from 'react-icons/fi';
import { criminalService } from '../../services/criminalService';
import { caseService } from '../../services/caseService';
import { getPhotoUrl } from '../../services/api';
import Spinner from '../ui/Spinner';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [criminals, setCriminals] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('criminals');

  useEffect(() => {
    if (!query) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      criminalService.search({ q: query, limit: 20 }),
      caseService.search({ q: query, limit: 20 }),
    ])
      .then(([crimRes, caseRes]) => {
        setCriminals(crimRes.data.data || []);
        setCases(caseRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {query ? (
            <>
              <h1 className="text-3xl font-extrabold text-justice-blue mb-2">
                {isBn ? 'অনুসন্ধান ফলাফল' : 'Search Results'}
              </h1>
              <p className="text-dark-gray flex items-center gap-2">
                <FiSearch className="text-justice-gold" />
                {isBn ? `"${query}" এর জন্য ${criminals.length + cases.length} টি ফলাফল পাওয়া গেছে` : `${criminals.length + cases.length} results for "${query}"`}
              </p>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-3xl text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-justice-blue mb-2">{isBn ? 'কী খুঁজতে চান?' : 'What are you looking for?'}</h2>
              <p className="text-dark-gray">{isBn ? 'অপরাধী বা মামলা খুঁজতে উপরে টাইপ করুন' : 'Type in the search bar above to find criminals or cases'}</p>
            </div>
          )}
        </div>

        {loading && <div className="py-20"><Spinner size="lg" text={isBn ? 'অনুসন্ধান চলছে...' : 'Searching...'} /></div>}

        {query && !loading && (
          <div>
            {/* Tabs */}
            <div className="flex flex-wrap gap-1 mb-8 bg-white rounded-xl p-1.5 shadow-sm border border-light-gray/60 w-full sm:w-fit">
              <button onClick={() => setActiveTab('criminals')}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex-1 sm:flex-none justify-center ${
                  activeTab === 'criminals' ? 'bg-justice-blue text-white shadow-lg' : 'text-gray-600 hover:text-justice-blue'
                }`}>
                <FiUsers className="text-sm sm:text-base" /> {isBn ? 'অপরাধী' : 'Criminals'} <span className={`ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${activeTab === 'criminals' ? 'bg-white/20' : 'bg-gray-100'}`}>{criminals.length}</span>
              </button>
              <button onClick={() => setActiveTab('cases')}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 flex-1 sm:flex-none justify-center ${
                  activeTab === 'cases' ? 'bg-justice-blue text-white shadow-lg' : 'text-gray-600 hover:text-justice-blue'
                }`}>
                <FiFileText className="text-sm sm:text-base" /> {isBn ? 'মামলা' : 'Cases'} <span className={`ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${activeTab === 'cases' ? 'bg-white/20' : 'bg-gray-100'}`}>{cases.length}</span>
              </button>
            </div>

            {/* Results */}
            {activeTab === 'criminals' && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {criminals.map((c) => (
                  <Link key={c._id} to={`/criminal/${c._id}`} className="group">
                    <Card hover className="h-full">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {c.photo ? (
                            <img src={getPhotoUrl(c.photo)} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FiUsers className="text-2xl text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-justice-blue group-hover:text-justice-gold transition-colors truncate">
                            {isBn && c.name_bn ? c.name_bn : c.name}
                          </h3>
                          {c.nid && <p className="text-xs text-dark-gray mt-0.5">NID: {c.nid}</p>}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-info-blue font-medium">{c.totalCases} {isBn ? 'মামলা' : 'cases'}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-justice-gold-dark font-medium">{c.totalBails} {isBn ? 'জামিন' : 'bails'}</span>
                          </div>
                          {c.isRepeatOffender && <Badge variant="repeat" className="mt-2" showIndicator>{isBn ? 'পুনরাবৃত্ত অপরাধী' : 'Repeat Offender'}</Badge>}
                        </div>
                        <FiArrowRight className="text-gray-300 group-hover:text-justice-gold group-hover:translate-x-1 transition-all flex-shrink-0 mt-2" />
                      </div>
                    </Card>
                  </Link>
                ))}
                {criminals.length === 0 && (
                  <div className="col-span-full text-center py-16 text-dark-gray">{isBn ? 'কোন অপরাধী পাওয়া যায়নি' : 'No criminals found'}</div>
                )}
              </div>
            )}

            {activeTab === 'cases' && (
              <div className="bg-white rounded-xl shadow-table overflow-hidden border border-light-gray/60">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-off-white border-b-2 border-light-gray">
                        <th className="px-6 py-4 text-left text-sm font-bold text-justice-blue">{isBn ? 'মামলা #' : 'Case #'}</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-justice-blue">{isBn ? 'অপরাধী' : 'Criminal'}</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-justice-blue">{isBn ? 'অবস্থা' : 'Status'}</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-justice-blue">{isBn ? 'ধারা' : 'Section'}</th>
                        <th className="px-6 py-4 text-left text-sm font-bold text-justice-blue">{isBn ? 'তারিখ' : 'Date'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-gray/60">
                      {cases.map((c) => (
                        <tr key={c._id} className="hover:bg-off-white transition-all">
                          <td className="px-6 py-4">
                            <Link to={`/case/${c._id}`} className="text-justice-gold font-bold hover:text-justice-gold-dark transition-colors">
                              {c.caseNumber}
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            {c.criminal ? (
                              <Link to={`/criminal/${c.criminal._id}`} className="font-medium text-gray-900 hover:text-justice-gold transition-colors">
                                {isBn && c.criminal.name_bn ? c.criminal.name_bn : c.criminal.name}
                              </Link>
                            ) : <span className="text-dark-gray">-</span>}
                          </td>
                          <td className="px-6 py-4"><Badge variant={c.status} showIndicator>{isBn ? { pending: 'বিচারাধীন', trial: 'বিচার চলছে', disposed: 'নিষ্পত্তি', appealed: 'আপিল' }[c.status] || c.status : c.status}</Badge></td>
                          <td className="px-6 py-4 text-sm text-dark-gray">{c.sectionLaw || '-'}</td>
                          <td className="px-6 py-4 text-sm text-dark-gray">{new Date(c.arrestDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {cases.length === 0 && (
                        <tr><td colSpan="5" className="px-6 py-16 text-center text-dark-gray">{isBn ? 'কোন মামলা পাওয়া যায়নি' : 'No cases found'}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
