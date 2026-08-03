import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiSave, FiSearch, FiX, FiFileText } from 'react-icons/fi';
import { hearingService } from '../../services/hearingService';
import { caseService } from '../../services/caseService';
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
          onFocus={() => results.length > 0 && setShowDropdown(true)} placeholder={placeholder}
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

export default function HearingEntry() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  const [form, setForm] = useState({
    case: '', hearingDate: '', hearingTime: '', courtRoom: '',
    hearingType: 'main', hearingStatus: 'scheduled', nextHearingDate: '',
    hearingSummaryEnglish: '', hearingSummaryBangla: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [caseResults, setCaseResults] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchingCase, setSearchingCase] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await hearingService.create(form);
      setMessage(isBn ? 'শুনানি সফলভাবে নির্ধারিত হয়েছে' : 'Hearing scheduled successfully');
      setForm({
        case: '', hearingDate: '', hearingTime: '', courtRoom: '',
        hearingType: 'main', hearingStatus: 'scheduled', nextHearingDate: '',
        hearingSummaryEnglish: '', hearingSummaryBangla: '',
      });
      setSelectedCase(null);
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
          <div className="w-14 h-14 bg-gradient-to-br from-info-blue to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
            <FiCalendar className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'শুনানি নির্ধারণ' : 'Hearing Schedule'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'শুনানির সম্পূর্ণ তথ্য রেকর্ড করুন' : 'Record complete hearing information'}</p>
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
                placeholder={isBn ? 'মামলা নম্বর বা আইডি...' : 'Case number or ID...'}
                value={form.case} required
                selectedItem={selectedCase}
                onSelect={(item) => { setSelectedCase(item); setForm(prev => ({ ...prev, case: item._id })); }}
                onClear={() => { setSelectedCase(null); setForm(prev => ({ ...prev, case: '' })); }}
                onSearch={(q) => { setSearchingCase(true); caseService.search({ q, limit: 10 }).then(r => setCaseResults(r.data.data || [])).catch(() => {}).finally(() => setSearchingCase(false)); }}
                results={caseResults} searching={searchingCase} icon={FiSearch}
                renderItem={(item, selected) => (
                  <><div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><FiFileText className="text-sm text-info-blue" /></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>{item.caseNumber}</p>
                    </div></>
                )}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শুনানির ধরন' : 'Hearing Type'} *</label>
                <select name="hearingType" value={form.hearingType} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white">
                  <option value="main">{isBn ? 'প্রধান শুনানি' : 'Main Hearing'}</option>
                  <option value="preliminary">{isBn ? 'প্রাথমিক শুনানি' : 'Preliminary'}</option>
                  <option value="final">{isBn ? 'চূড়ান্ত শুনানি' : 'Final'}</option>
                  <option value="adjournment">{isBn ? 'মুলতবি' : 'Adjournment'}</option>
                  <option value="bail">{isBn ? 'জামিন শুনানি' : 'Bail'}</option>
                  <option value="motion">{isBn ? 'মোশন' : 'Motion'}</option>
                  <option value="others">{isBn ? 'অন্যান্য' : 'Others'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শুনানির তারিখ' : 'Hearing Date'} *</label>
                <input type="date" name="hearingDate" value={form.hearingDate} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'সময়' : 'Time'} *</label>
                <input type="time" name="hearingTime" value={form.hearingTime} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'কক্ষ নম্বর' : 'Court Room'} *</label>
                <input type="text" name="courtRoom" value={form.courtRoom} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শুনানির অবস্থা' : 'Status'}</label>
                <select name="hearingStatus" value={form.hearingStatus} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white">
                  <option value="scheduled">{isBn ? 'নির্ধারিত' : 'Scheduled'}</option>
                  <option value="completed">{isBn ? 'সম্পন্ন' : 'Completed'}</option>
                  <option value="adjourned">{isBn ? 'মুলতবি' : 'Adjourned'}</option>
                  <option value="cancelled">{isBn ? 'বাতিল' : 'Cancelled'}</option>
                  <option value="rescheduled">{isBn ? 'পুনঃনির্ধারিত' : 'Rescheduled'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'পরবর্তী শুনানির তারিখ' : 'Next Hearing Date'}</label>
                <input type="date" name="nextHearingDate" value={form.nextHearingDate} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শুনানির সারসংক্ষেপ (ইংরেজি)' : 'Hearing Summary (English)'}</label>
              <textarea name="hearingSummaryEnglish" value={form.hearingSummaryEnglish} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শুনানির সারসংক্ষেপ (বাংলা)' : 'Hearing Summary (Bengali)'}</label>
              <textarea name="hearingSummaryBangla" value={form.hearingSummaryBangla} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
            </div>

            <Button type="submit" loading={loading} variant="primary" size="lg" className="w-full" icon={<FiSave />}>
              {isBn ? 'শুনানি নির্ধারণ করুন' : 'Schedule Hearing'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
