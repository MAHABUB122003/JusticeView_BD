import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiShield, FiSave, FiUsers, FiSearch, FiX, FiFileText } from 'react-icons/fi';
import { punishmentService } from '../../services/punishmentService';
import { caseService } from '../../services/caseService';
import { criminalService } from '../../services/criminalService';
import { judgmentService } from '../../services/judgmentService';
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

export default function PunishmentRecord() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  const [form, setForm] = useState({
    case: '', criminal: '', judgment: '',
    punishmentType: '', imprisonmentYears: 0, imprisonmentMonths: 0, imprisonmentDays: 0,
    sentenceType: 'simple', fineAmount: 0, finePaymentStatus: 'pending',
    sentenceStartDate: '', prisonLocation: '', prisonCell: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [caseResults, setCaseResults] = useState([]);
  const [criminalResults, setCriminalResults] = useState([]);
  const [judgmentResults, setJudgmentResults] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [selectedJudgment, setSelectedJudgment] = useState(null);
  const [searchingCase, setSearchingCase] = useState(false);
  const [searchingCriminal, setSearchingCriminal] = useState(false);
  const [searchingJudgment, setSearchingJudgment] = useState(false);
  const [showImprisonment, setShowImprisonment] = useState(false);
  const [showFine, setShowFine] = useState(false);

  const handleChange = (e) => {
    const val = e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: val }));
    if (e.target.name === 'punishmentType') {
      setShowImprisonment(['imprisonment', 'both', 'hard_labor', 'life_imprisonment', 'death'].includes(val));
      setShowFine(['fine', 'both'].includes(val));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await punishmentService.create({
        ...form,
        imprisonmentYears: parseInt(form.imprisonmentYears) || 0,
        imprisonmentMonths: parseInt(form.imprisonmentMonths) || 0,
        imprisonmentDays: parseInt(form.imprisonmentDays) || 0,
        fineAmount: parseFloat(form.fineAmount) || 0,
      });
      setMessage(isBn ? 'শাস্তি সফলভাবে রেকর্ড করা হয়েছে' : 'Punishment recorded successfully');
      setForm({
        case: '', criminal: '', judgment: '', punishmentType: '',
        imprisonmentYears: 0, imprisonmentMonths: 0, imprisonmentDays: 0,
        sentenceType: 'simple', fineAmount: 0, finePaymentStatus: 'pending',
        sentenceStartDate: '', prisonLocation: '', prisonCell: '',
      });
      setSelectedCase(null); setSelectedCriminal(null); setSelectedJudgment(null);
      setShowImprisonment(false); setShowFine(false);
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
            <FiShield className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'শাস্তির রেকর্ড' : 'Punishment Record'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'শাস্তির সম্পূর্ণ তথ্য রেকর্ড করুন' : 'Record complete punishment information'}</p>
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
              <SearchSelect label={isBn ? 'মামলা' : 'Case'} placeholder={isBn ? 'মামলা নম্বর...' : 'Case number...'}
                value={form.case} required selectedItem={selectedCase}
                onSelect={(item) => { setSelectedCase(item); setForm(prev => ({ ...prev, case: item._id })); }}
                onClear={() => { setSelectedCase(null); setForm(prev => ({ ...prev, case: '' })); }}
                onSearch={(q) => { setSearchingCase(true); caseService.search({ q, limit: 10 }).then(r => setCaseResults(r.data.data || [])).catch(() => {}).finally(() => setSearchingCase(false)); }}
                results={caseResults} searching={searchingCase} icon={FiFileText}
                renderItem={(item, selected) => (
                  <><div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><FiFileText className="text-sm text-info-blue" /></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>{item.caseNumber}</p>
                    </div></>
                )}
              />

              <SearchSelect label={isBn ? 'অপরাধী' : 'Criminal'} placeholder={isBn ? 'নাম বা আইডি...' : 'Name or ID...'}
                value={form.criminal} required selectedItem={selectedCriminal}
                onSelect={(item) => { setSelectedCriminal(item); setForm(prev => ({ ...prev, criminal: item._id })); }}
                onClear={() => { setSelectedCriminal(null); setForm(prev => ({ ...prev, criminal: '' })); }}
                onSearch={(q) => { setSearchingCriminal(true); criminalService.search({ q, limit: 10 }).then(r => setCriminalResults(r.data.data || [])).catch(() => {}).finally(() => setSearchingCriminal(false)); }}
                results={criminalResults} searching={searchingCriminal} icon={FiUsers}
                renderItem={(item, selected) => (
                  <><div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.photo ? <img src={item.photo} alt="" className="w-full h-full object-cover" /> : <FiUsers className="text-sm text-gray-400" />}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>{isBn && item.name_bn ? item.name_bn : item.name}</p>
                    </div></>
                )}
              />

              <SearchSelect label={isBn ? 'রায়' : 'Judgment'} placeholder={isBn ? 'রায় আইডি...' : 'Judgment ID...'}
                value={form.judgment} required selectedItem={selectedJudgment}
                onSelect={(item) => { setSelectedJudgment(item); setForm(prev => ({ ...prev, judgment: item._id })); }}
                onClear={() => { setSelectedJudgment(null); setForm(prev => ({ ...prev, judgment: '' })); }}
                onSearch={(q) => { setSearchingJudgment(true); judgmentService.search({ q }).then(r => setJudgmentResults(r.data.data || [])).catch(() => {}).finally(() => setSearchingJudgment(false)); }}
                results={judgmentResults} searching={searchingJudgment} icon={FiFileText}
                renderItem={(item, selected) => (
                  <><div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0"><FiShield className="text-sm text-court-red" /></div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>{item.judgmentId}</p>
                      <p className="text-xs text-dark-gray">{item.verdictStatus}</p>
                    </div></>
                )}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শাস্তির ধরন' : 'Punishment Type'} *</label>
                <select name="punishmentType" value={form.punishmentType} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white">
                  <option value="">{isBn ? 'নির্বাচন করুন' : 'Select...'}</option>
                  <option value="imprisonment">{isBn ? 'কারাদণ্ড' : 'Imprisonment'}</option>
                  <option value="fine">{isBn ? 'অর্থদণ্ড' : 'Fine'}</option>
                  <option value="both">{isBn ? 'কারাদণ্ড ও অর্থদণ্ড' : 'Both'}</option>
                  <option value="life_imprisonment">{isBn ? 'যাবজ্জীবন কারাদণ্ড' : 'Life Imprisonment'}</option>
                  <option value="death">{isBn ? 'মৃত্যুদণ্ড' : 'Death Sentence'}</option>
                  <option value="hard_labor">{isBn ? 'সশ্রম কারাদণ্ড' : 'Hard Labor'}</option>
                  <option value="others">{isBn ? 'অন্যান্য' : 'Others'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'কারাগারের অবস্থান' : 'Prison Location'}</label>
                <select name="prisonLocation" value={form.prisonLocation} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white">
                  <option value="">{isBn ? 'নির্বাচন করুন' : 'Select...'}</option>
                  <option value="Dhaka Central Jail">Dhaka Central Jail</option>
                  <option value="Kashimpur Central Jail">Kashimpur Central Jail</option>
                  <option value="Chattogram Central Jail">Chattogram Central Jail</option>
                  <option value="Rajshahi Central Jail">Rajshahi Central Jail</option>
                  <option value="Sylhet Central Jail">Sylhet Central Jail</option>
                </select>
              </div>
            </div>

            {showImprisonment && (
              <div className="border-t border-light-gray pt-5 space-y-5">
                <h3 className="text-sm font-bold text-gray-800">{isBn ? 'কারাদণ্ডের বিবরণ' : 'Imprisonment Details'}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'বছর' : 'Years'}</label>
                    <input type="number" name="imprisonmentYears" value={form.imprisonmentYears} onChange={handleChange} min="0"
                      className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'মাস' : 'Months'}</label>
                    <input type="number" name="imprisonmentMonths" value={form.imprisonmentMonths} onChange={handleChange} min="0" max="11"
                      className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'দিন' : 'Days'}</label>
                    <input type="number" name="imprisonmentDays" value={form.imprisonmentDays} onChange={handleChange} min="0" max="30"
                      className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'সাজার ধরন' : 'Sentence Type'}</label>
                    <select name="sentenceType" value={form.sentenceType} onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white">
                      <option value="simple">{isBn ? 'সরল' : 'Simple'}</option>
                      <option value="rigorous">{isBn ? 'সশ্রম' : 'Rigorous'}</option>
                      <option value="both">{isBn ? 'উভয়' : 'Both'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'সাজা শুরুর তারিখ' : 'Sentence Start Date'}</label>
                    <input type="date" name="sentenceStartDate" value={form.sentenceStartDate} onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'কক্ষ নম্বর' : 'Cell Number'}</label>
                    <input type="text" name="prisonCell" value={form.prisonCell} onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                  </div>
                </div>
              </div>
            )}

            {showFine && (
              <div className="border-t border-light-gray pt-5 space-y-5">
                <h3 className="text-sm font-bold text-gray-800">{isBn ? 'অর্থদণ্ডের বিবরণ' : 'Fine Details'}</h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'অর্থদণ্ডের পরিমাণ' : 'Fine Amount'}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-4 text-gray-400 font-semibold">৳</span>
                      <input type="number" name="fineAmount" value={form.fineAmount} onChange={handleChange} min="0"
                        className="w-full h-12 pl-10 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'পরিশোধের অবস্থা' : 'Payment Status'}</label>
                    <select name="finePaymentStatus" value={form.finePaymentStatus} onChange={handleChange}
                      className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white">
                      <option value="pending">{isBn ? 'অবৈতনিক' : 'Pending'}</option>
                      <option value="paid">{isBn ? 'পরিশোধিত' : 'Paid'}</option>
                      <option value="partially_paid">{isBn ? 'আংশিক' : 'Partially Paid'}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" loading={loading} variant="danger" size="lg" className="w-full" icon={<FiSave />}>
              {isBn ? 'শাস্তি রেকর্ড করুন' : 'Record Punishment'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
