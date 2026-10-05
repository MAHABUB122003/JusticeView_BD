import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBookOpen, FiSave, FiUsers, FiSearch, FiX, FiShield, FiBriefcase, FiAnchor } from 'react-icons/fi';
import { bailService } from '../../services/bailService';
import { caseService } from '../../services/caseService';
import { criminalService } from '../../services/criminalService';
import { lawyerService } from '../../services/lawyerService';
import { judgeService } from '../../services/judgeService';
import { getPhotoUrl } from '../../services/api';
import Button from '../ui/Button';
import Card from '../ui/Card';

function SearchSelect({ label, placeholder, value, onChange, onSearch, results, searching, selectedItem, onSelect, onClear, icon: Icon, renderItem, onTextChange, required = false }) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(null);
  const timeout = useRef(null);

  useEffect(() => {
    if (selectedItem) {
      setQuery(selectedItem.name || selectedItem.caseNumber || '');
    }
  }, [selectedItem]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (val) => {
    setQuery(val);
    if (onTextChange) onTextChange(val);
    if (timeout.current) clearTimeout(timeout.current);
    if (!val.trim()) { setShowDropdown(false); return; }
    timeout.current = setTimeout(() => {
      onSearch(val.trim());
      setShowDropdown(true);
    }, 300);
  };

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}{required ? ' *' : ''}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => { handleSearch(e.target.value); if (selectedItem) onClear(); }}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-12 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none"
        />
        {selectedItem && (
          <button type="button" onClick={() => { onClear(); setQuery(''); }} className="absolute right-4 top-3.5 text-gray-400 hover:text-court-red">
            <FiX className="text-lg" />
          </button>
        )}
        {searching && (
          <div className="absolute right-14 top-3.5">
            <svg className="animate-spin h-5 w-5 text-justice-gold" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="mt-2 flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
          {renderItem(selectedItem, true)}
        </div>
      )}

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-light-gray/60 max-h-48 overflow-y-auto">
          {results.map(item => (
            <button key={item._id} type="button" onClick={() => { onSelect(item); setShowDropdown(false); setQuery(item.name || item.caseNumber || ''); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-off-white transition-colors w-full text-left border-b border-light-gray/40 last:border-b-0">
              {renderItem(item, false)}
            </button>
          ))}
        </div>
      )}

      {showDropdown && query.trim() && !searching && results.length === 0 && (
        <div className="absolute z-50 mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-light-gray/60 p-3 text-center">
          <p className="text-sm text-dark-gray">No results found</p>
        </div>
      )}
    </div>
  );
}

export default function BailEntry() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  const [form, setForm] = useState({
    case: '', criminal: '', lawyer: '', judge: '', bailDate: '',
    bailAmount: '', hearingDate: '', nextHearingDate: '',
    punishment: '', punishment_bn: '', notes: '', notes_bn: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [caseResults, setCaseResults] = useState([]);
  const [criminalResults, setCriminalResults] = useState([]);
  const [lawyerResults, setLawyerResults] = useState([]);
  const [judgeResults, setJudgeResults] = useState([]);

  const [searchingCase, setSearchingCase] = useState(false);
  const [searchingCriminal, setSearchingCriminal] = useState(false);
  const [searchingLawyer, setSearchingLawyer] = useState(false);
  const [searchingJudge, setSearchingJudge] = useState(false);

  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [selectedJudge, setSelectedJudge] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    clearFieldError(e.target.name);
  };

  const clearFieldError = (field) => setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setFieldErrors({});
    try {
      await bailService.create({ ...form, bailAmount: parseFloat(form.bailAmount) || 0 });
      setMessage(isBn ? 'জামিন রেকর্ড সফলভাবে তৈরি হয়েছে' : 'Bail record created successfully');
      setForm({ case: '', criminal: '', lawyer: '', judge: '', bailDate: '', bailAmount: '', hearingDate: '', nextHearingDate: '', punishment: '', punishment_bn: '', notes: '', notes_bn: '' });
      setSelectedCase(null); setSelectedCriminal(null); setSelectedLawyer(null); setSelectedJudge(null);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        const errors = {};
        data.errors.forEach(e => { if (e.field) errors[e.field] = e.message; });
        setFieldErrors(errors);
        setMessage(data.message || 'Validation failed');
      } else {
        setMessage(data?.message || 'Error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-justice-gold to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FiBookOpen className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'জামিন এন্ট্রি' : 'Bail Entry'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'জামিনের সম্পূর্ণ তথ্য রেকর্ড করুন' : 'Record complete bail information'}</p>
          </div>
        </div>

        <Card>
          {message && (
            <div className={`px-5 py-4 rounded-xl mb-6 text-sm flex items-center gap-2 border ${
              message.includes('successfully') || message.includes('সফলভাবে')
                ? 'bg-green-50 border-green-200 text-success-green'
                : 'bg-red-50 border-red-200 text-court-red'
            }`}>
              {message.includes('successfully') || message.includes('সফলভাবে') ? '✓' : '⚠'} {message}
            </div>
          )}

          {Object.keys(fieldErrors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-court-red mb-2">{isBn ? 'নীচের ক্ষেত্রগুলি ঠিক করুন' : 'Fix the following fields:'}</p>
              <ul className="space-y-1">
                {Object.entries(fieldErrors).map(([field, msg]) => (
                  <li key={field} className="text-xs text-court-red flex items-center gap-2">
                    <span>•</span> <span className="font-medium capitalize">{field}:</span> {msg}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <SearchSelect
                  label={isBn ? 'মামলা আইডি' : 'Case ID'}
                  placeholder={isBn ? 'মামলা নম্বর বা আইডি লিখুন...' : 'Type case number or ID...'}
                  value={form.case}
                  required
                  selectedItem={selectedCase}
                  onSelect={(item) => {
                    setSelectedCase(item);
                    setForm(prev => ({ ...prev, case: item._id }));
                    if (item.criminal) {
                      const crim = item.criminal;
                      setSelectedCriminal(crim);
                      setForm(prev => ({ ...prev, criminal: crim._id || crim }));
                    }
                    clearFieldError('case');
                  }}
                  onClear={() => { setSelectedCase(null); setForm(prev => ({ ...prev, case: '' })); }}
                  onSearch={(q) => {
                    setSearchingCase(true);
                    caseService.search({ q, limit: 10 })
                      .then(r => setCaseResults(r.data.data || []))
                      .catch(() => {})
                      .finally(() => setSearchingCase(false));
                  }}
                  results={caseResults}
                  searching={searchingCase}
                  icon={FiSearch}
                  renderItem={(item, selected) => (
                    <>
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <FiBriefcase className="text-sm text-info-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>
                          {item.caseNumber}
                        </p>
                        <p className="text-xs text-dark-gray truncate">
                          {item.criminal?.name || item.criminal?.name_bn || ''}
                        </p>
                      </div>
                    </>
                  )}
                />
                {fieldErrors.case && <p className="text-xs text-court-red mt-1">{fieldErrors.case}</p>}
              </div>

              <div>
                <SearchSelect
                  label={isBn ? 'অপরাধী আইডি' : 'Criminal ID'}
                  placeholder={isBn ? 'নাম, NID বা আইডি লিখুন...' : 'Type name, NID, or ID...'}
                  value={form.criminal}
                  required
                  selectedItem={selectedCriminal}
                  onSelect={(item) => {
                    setSelectedCriminal(item);
                    setForm(prev => ({ ...prev, criminal: item._id }));
                    clearFieldError('criminal');
                  }}
                  onClear={() => { setSelectedCriminal(null); setForm(prev => ({ ...prev, criminal: '' })); }}
                  onSearch={(q) => {
                    setSearchingCriminal(true);
                    criminalService.search({ q, limit: 10 })
                      .then(r => setCriminalResults(r.data.data || []))
                      .catch(() => {})
                      .finally(() => setSearchingCriminal(false));
                  }}
                  results={criminalResults}
                  searching={searchingCriminal}
                  icon={FiUsers}
                  renderItem={(item, selected) => (
                    <>
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.photo ? <img src={getPhotoUrl(item.photo)} alt="" className="w-full h-full object-cover" />
                          : <FiUsers className="text-sm text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>
                          {isBn && item.name_bn ? item.name_bn : item.name}
                        </p>
                        <p className="text-xs text-dark-gray truncate">ID: {item._id}{item.nid ? ` | NID: ${item.nid}` : ''}</p>
                      </div>
                    </>
                  )}
                />
                {fieldErrors.criminal && <p className="text-xs text-court-red mt-1">{fieldErrors.criminal}</p>}
              </div>

              <div>
                <SearchSelect
                  label={isBn ? 'উকিল' : 'Lawyer'}
                  placeholder={isBn ? 'নাম, বার কাউন্সিল নং বা আইডি...' : 'Type name, bar council no, or ID...'}
                  value={form.lawyer}
                  selectedItem={selectedLawyer}
                  onSelect={(item) => {
                    setSelectedLawyer(item);
                    setForm(prev => ({ ...prev, lawyer: item._id }));
                    clearFieldError('lawyer');
                  }}
                  onClear={() => { setSelectedLawyer(null); setForm(prev => ({ ...prev, lawyer: '' })); }}
                  onSearch={(q) => {
                    setSearchingLawyer(true);
                    lawyerService.search({ q })
                      .then(r => setLawyerResults(r.data.data || []))
                      .catch(() => {})
                      .finally(() => setSearchingLawyer(false));
                  }}
                  results={lawyerResults}
                  searching={searchingLawyer}
                  icon={FiShield}
                  renderItem={(item, selected) => (
                    <>
                      <div className="w-9 h-9 rounded-lg bg-justice-blue/5 flex items-center justify-center text-justice-blue flex-shrink-0">
                        <FiShield className="text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>
                          {isBn && item.name_bn ? item.name_bn : item.name}
                        </p>
                        <p className="text-xs text-dark-gray truncate">{item.barCouncilNumber ? `Bar: ${item.barCouncilNumber}` : ''}</p>
                      </div>
                    </>
                  )}
                />
              </div>

              <div>
                <SearchSelect
                  label={isBn ? 'বিচারক' : 'Judge'}
                  placeholder={isBn ? 'নাম বা আইডি লিখুন...' : 'Type name or ID...'}
                  value={form.judge}
                  selectedItem={selectedJudge}
                  onSelect={(item) => {
                    setSelectedJudge(item);
                    setForm(prev => ({ ...prev, judge: item._id }));
                    clearFieldError('judge');
                  }}
                  onClear={() => { setSelectedJudge(null); setForm(prev => ({ ...prev, judge: '' })); }}
                  onSearch={(q) => {
                    setSearchingJudge(true);
                    judgeService.getAll({ q })
                      .then(r => {
                        const all = r.data.data || [];
                        const filtered = all.filter(j =>
                          j.name?.toLowerCase().includes(q.toLowerCase()) ||
                          (j.name_bn && j.name_bn.includes(q)) ||
                          j._id.includes(q)
                        );
                        setJudgeResults(filtered);
                      })
                      .catch(() => {})
                      .finally(() => setSearchingJudge(false));
                  }}
                  results={judgeResults}
                  searching={searchingJudge}
                  icon={FiAnchor}
                  renderItem={(item, selected) => (
                    <>
                      <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                        <FiAnchor className="text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>
                          {isBn && item.name_bn ? item.name_bn : item.name}
                        </p>
                        <p className="text-xs text-dark-gray truncate">{item.designation || ''}</p>
                      </div>
                    </>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'জামিনের তারিখ' : 'Bail Date'} *</label>
                <input type="date" name="bailDate" value={form.bailDate} onChange={handleChange} required
                  className={`w-full h-12 px-4 border-2 rounded-xl focus:ring-4 transition-all text-sm outline-none ${fieldErrors.bailDate ? 'border-court-red focus:ring-red-200' : 'border-light-gray focus:border-justice-gold focus:ring-justice-gold/20'}`} />
                {fieldErrors.bailDate && <p className="text-xs text-court-red mt-1">{fieldErrors.bailDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'জামিনের পরিমাণ' : 'Bail Amount'}</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-400 font-semibold">৳</span>
                  <input type="number" name="bailAmount" value={form.bailAmount} onChange={handleChange}
                    className={`w-full h-12 pl-10 pr-4 border-2 rounded-xl focus:ring-4 transition-all text-sm outline-none ${fieldErrors.bailAmount ? 'border-court-red focus:ring-red-200' : 'border-light-gray focus:border-justice-gold focus:ring-justice-gold/20'}`} />
                </div>
                {fieldErrors.bailAmount && <p className="text-xs text-court-red mt-1">{fieldErrors.bailAmount}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শুনানির তারিখ' : 'Hearing Date'}</label>
                <input type="date" name="hearingDate" value={form.hearingDate} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'পরবর্তী শুনানি' : 'Next Hearing'}</label>
                <input type="date" name="nextHearingDate" value={form.nextHearingDate} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>

            <div className="border-t border-light-gray pt-5 mt-2">
              <h3 className="text-sm font-bold text-gray-800 mb-3">{isBn ? 'শাস্তির বিবরণ' : 'Punishment Details'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শাস্তি (ইংরেজি)' : 'Punishment (English)'}</label>
                  <textarea name="punishment" value={form.punishment} onChange={handleChange} rows={2}
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" placeholder={isBn ? 'শাস্তির বিবরণ লিখুন...' : 'Describe the punishment...'} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শাস্তি (বাংলা)' : 'Punishment (Bengali)'}</label>
                  <textarea name="punishment_bn" value={form.punishment_bn} onChange={handleChange} rows={2}
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" placeholder={isBn ? 'শাস্তির বিবরণ বাংলায় লিখুন...' : 'Describe the punishment in Bengali...'} />
                </div>
              </div>
            </div>

            <div className="border-t border-light-gray pt-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3">{isBn ? 'অতিরিক্ত নোট' : 'Additional Notes'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'নোট (ইংরেজি)' : 'Notes (English)'}</label>
                  <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'নোট (বাংলা)' : 'Notes (Bengali)'}</label>
                  <textarea name="notes_bn" value={form.notes_bn} onChange={handleChange} rows={3}
                    className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
                </div>
              </div>
            </div>

            <Button type="submit" loading={loading} variant="gold" size="lg" className="w-full" icon={<FiSave />}>
              {isBn ? 'জামিন রেকর্ড তৈরি করুন' : 'Create Bail Record'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
