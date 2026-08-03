import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBook, FiSave, FiUsers, FiAnchor, FiSearch, FiX, FiFileText } from 'react-icons/fi';
import { judgmentService } from '../../services/judgmentService';
import { caseService } from '../../services/caseService';
import { criminalService } from '../../services/criminalService';
import Button from '../ui/Button';
import Card from '../ui/Card';

function SearchSelect({ label, placeholder, value, onSearch, results, searching, selectedItem, onSelect, onClear, icon: Icon, renderItem, required }) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (val) => {
    setQuery(val);
    if (!val.trim()) { setShowDropdown(false); return; }
    onSearch(val.trim());
    setShowDropdown(true);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}{required ? ' *' : ''}</label>
      <div className="relative">
        <Icon className="absolute left-4 top-4 text-gray-400" />
        <input type="text" value={query} onChange={(e) => { handleSearch(e.target.value); if (selectedItem) onClear(); }}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-12 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
        {selectedItem && (
          <button type="button" onClick={() => { onClear(); setQuery(''); }} className="absolute right-4 top-3.5 text-gray-400 hover:text-court-red">
            <FiX className="text-lg" />
          </button>
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
    </div>
  );
}

export default function JudgmentEntry() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  const [form, setForm] = useState({
    case: '', criminal: '', judge: '', judgmentDate: '', judgmentTime: '',
    verdictStatus: '', verdictType: 'conviction',
    judgmentSummaryEnglish: '', judgmentSummaryBangla: '', keyPoints: '',
    applicableLaw: '', lawSection: '', precedentCases: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [caseResults, setCaseResults] = useState([]);
  const [criminalResults, setCriminalResults] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [searchingCase, setSearchingCase] = useState(false);
  const [searchingCriminal, setSearchingCriminal] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await judgmentService.create(form);
      setMessage(isBn ? 'রায় সফলভাবে রেকর্ড করা হয়েছে' : 'Judgment recorded successfully');
      setForm({
        case: '', criminal: '', judge: '', judgmentDate: '', judgmentTime: '',
        verdictStatus: '', verdictType: 'conviction',
        judgmentSummaryEnglish: '', judgmentSummaryBangla: '', keyPoints: '',
        applicableLaw: '', lawSection: '', precedentCases: '',
      });
      setSelectedCase(null);
      setSelectedCriminal(null);
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
          <div className="w-14 h-14 bg-gradient-to-br from-court-red to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
            <FiBook className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'রায় এন্ট্রি' : 'Judgment Entry'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'রায়ের সম্পূর্ণ তথ্য রেকর্ড করুন' : 'Record complete judgment information'}</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <SearchSelect
                label={isBn ? 'মামলা' : 'Case'}
                placeholder={isBn ? 'মামলা নম্বর বা আইডি লিখুন...' : 'Type case number or ID...'}
                value={form.case} required
                selectedItem={selectedCase}
                onSelect={(item) => {
                  setSelectedCase(item);
                  setForm(prev => ({ ...prev, case: item._id }));
                  if (item.criminal) {
                    setSelectedCriminal(item.criminal);
                    setForm(prev => ({ ...prev, criminal: item.criminal._id || item.criminal }));
                  }
                }}
                onClear={() => { setSelectedCase(null); setForm(prev => ({ ...prev, case: '' })); }}
                onSearch={(q) => { setSearchingCase(true); caseService.search({ q, limit: 10 }).then(r => setCaseResults(r.data.data || [])).catch(() => {}).finally(() => setSearchingCase(false)); }}
                results={caseResults} searching={searchingCase} icon={FiFileText}
                renderItem={(item, selected) => (
                  <><div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><FiFileText className="text-sm text-info-blue" /></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>{item.caseNumber}</p>
                      <p className="text-xs text-dark-gray truncate">{item.criminal?.name || ''}</p>
                    </div></>
                )}
              />

              <SearchSelect
                label={isBn ? 'অপরাধী' : 'Criminal'}
                placeholder={isBn ? 'নাম, NID বা আইডি লিখুন...' : 'Type name, NID, or ID...'}
                value={form.criminal} required
                selectedItem={selectedCriminal}
                onSelect={(item) => { setSelectedCriminal(item); setForm(prev => ({ ...prev, criminal: item._id })); }}
                onClear={() => { setSelectedCriminal(null); setForm(prev => ({ ...prev, criminal: '' })); }}
                onSearch={(q) => { setSearchingCriminal(true); criminalService.search({ q, limit: 10 }).then(r => setCriminalResults(r.data.data || [])).catch(() => {}).finally(() => setSearchingCriminal(false)); }}
                results={criminalResults} searching={searchingCriminal} icon={FiUsers}
                renderItem={(item, selected) => (
                  <><div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.photo ? <img src={item.photo} alt="" className="w-full h-full object-cover" /> : <FiUsers className="text-sm text-gray-400" />}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>{isBn && item.name_bn ? item.name_bn : item.name}</p>
                      <p className="text-xs text-dark-gray truncate">ID: {item._id}</p>
                    </div></>
                )}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'রায়ের তারিখ' : 'Judgment Date'} *</label>
                <input type="date" name="judgmentDate" value={form.judgmentDate} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'সময়' : 'Time'}</label>
                <input type="time" name="judgmentTime" value={form.judgmentTime} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'রায়ের অবস্থা' : 'Verdict Status'} *</label>
                <select name="verdictStatus" value={form.verdictStatus} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white">
                  <option value="">{isBn ? 'নির্বাচন করুন' : 'Select...'}</option>
                  <option value="guilty">{isBn ? 'দোষী' : 'Guilty'}</option>
                  <option value="not_guilty">{isBn ? 'নির্দোষ' : 'Not Guilty'}</option>
                  <option value="acquitted">{isBn ? 'খালাস' : 'Acquitted'}</option>
                  <option value="discharged">{isBn ? 'সাব্যস্ত' : 'Discharged'}</option>
                  <option value="dismissed">{isBn ? 'খারিজ' : 'Dismissed'}</option>
                  <option value="sentenced">{isBn ? 'দণ্ডপ্রাপ্ত' : 'Sentenced'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'রায়ের ধরন' : 'Verdict Type'} *</label>
                <select name="verdictType" value={form.verdictType} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white">
                  <option value="conviction">{isBn ? 'দণ্ডাদেশ' : 'Conviction'}</option>
                  <option value="acquittal">{isBn ? 'খালাস' : 'Acquittal'}</option>
                  <option value="stay">{isBn ? 'স্থগিত' : 'Stay'}</option>
                  <option value="adjournment">{isBn ? 'মুলতবি' : 'Adjournment'}</option>
                  <option value="transfer">{isBn ? 'হস্তান্তর' : 'Transfer'}</option>
                  <option value="others">{isBn ? 'অন্যান্য' : 'Others'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'প্রযোজ্য আইন' : 'Applicable Law'}</label>
                <input type="text" name="applicableLaw" value={form.applicableLaw} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'ধারা' : 'Section'}</label>
                <input type="text" name="lawSection" value={form.lawSection} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'রায়ের সারসংক্ষেপ (ইংরেজি)' : 'Judgment Summary (English)'}</label>
              <textarea name="judgmentSummaryEnglish" value={form.judgmentSummaryEnglish} onChange={handleChange} rows={4}
                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'রায়ের সারসংক্ষেপ (বাংলা)' : 'Judgment Summary (Bengali)'}</label>
              <textarea name="judgmentSummaryBangla" value={form.judgmentSummaryBangla} onChange={handleChange} rows={4}
                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'মূল পয়েন্ট' : 'Key Points'}</label>
              <textarea name="keyPoints" value={form.keyPoints} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none"
                placeholder={isBn ? 'প্রতি লাইনে একটি করে পয়েন্ট লিখুন' : 'One point per line'} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'পূর্ববর্তী মামলা (রেফারেন্স)' : 'Precedent Cases'}</label>
              <textarea name="precedentCases" value={form.precedentCases} onChange={handleChange} rows={2}
                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
            </div>

            <Button type="submit" loading={loading} variant="danger" size="lg" className="w-full" icon={<FiSave />}>
              {isBn ? 'রায় রেকর্ড করুন' : 'Record Judgment'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
