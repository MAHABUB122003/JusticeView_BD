import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiFileText, FiSave, FiUsers, FiSearch, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { chargeSheetService } from '../../services/chargeSheetService';
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

export default function ChargeSheetEntry() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  const [form, setForm] = useState({
    chargeSheetNo: '', case: '', criminal: '', submittedDate: '',
    charges: [{ charge: '', section: '' }],
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

  const handleChargeChange = (index, field, value) => {
    const updated = [...form.charges];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, charges: updated }));
  };

  const addCharge = () => {
    setForm(prev => ({ ...prev, charges: [...prev.charges, { charge: '', section: '' }] }));
  };

  const removeCharge = (index) => {
    if (form.charges.length <= 1) return;
    setForm(prev => ({ ...prev, charges: prev.charges.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await chargeSheetService.create(form);
      setMessage(isBn ? 'চার্জশিট সফলভাবে দাখিল করা হয়েছে' : 'Charge sheet submitted successfully');
      setForm({
        chargeSheetNo: '', case: '', criminal: '', submittedDate: '',
        charges: [{ charge: '', section: '' }],
      });
      setSelectedCase(null); setSelectedCriminal(null);
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
            <FiFileText className="text-2xl text-justice-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'চার্জশিট দাখিল' : 'Charge Sheet'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'মামলার চার্জশিট দাখিল করুন' : 'Submit charge sheet for the case'}</p>
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'চার্জশিট নম্বর' : 'Charge Sheet No'} *</label>
                <input type="text" name="chargeSheetNo" value={form.chargeSheetNo} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'দাখিলের তারিখ' : 'Submission Date'} *</label>
                <input type="date" name="submittedDate" value={form.submittedDate} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              <SearchSelect label={isBn ? 'মামলা' : 'Case'} placeholder={isBn ? 'মামলা নম্বর...' : 'Case number...'}
                value={form.case} required selectedItem={selectedCase}
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
            </div>

            <div className="border-t border-light-gray pt-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">{isBn ? 'অভিযোগসমূহ' : 'Charges'}</h3>
                <Button type="button" variant="outline" size="sm" icon={<FiPlus />} onClick={addCharge}>
                  {isBn ? 'অভিযোগ যোগ করুন' : 'Add Charge'}
                </Button>
              </div>

              {form.charges.map((charge, index) => (
                <div key={index} className="grid md:grid-cols-2 gap-4 mb-4 p-4 rounded-xl bg-gray-50 border border-light-gray/60">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{isBn ? 'অভিযোগের বিবরণ' : 'Charge Description'}</label>
                    <input type="text" value={charge.charge} onChange={(e) => handleChargeChange(index, 'charge', e.target.value)}
                      className="w-full h-10 px-4 border-2 border-light-gray rounded-lg focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none"
                      placeholder={isBn ? 'অভিযোগের বিবরণ লিখুন' : 'Describe the charge'} />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-gray-600 mb-1">{isBn ? 'ধারা' : 'Section'}</label>
                      <input type="text" value={charge.section} onChange={(e) => handleChargeChange(index, 'section', e.target.value)}
                        className="w-full h-10 px-4 border-2 border-light-gray rounded-lg focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none"
                        placeholder={isBn ? 'আইনের ধারা' : 'Law section'} />
                    </div>
                    {form.charges.length > 1 && (
                      <button type="button" onClick={() => removeCharge(index)}
                        className="h-10 px-3 rounded-lg bg-red-50 text-court-red hover:bg-red-100 transition-colors">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" loading={loading} variant="primary" size="lg" className="w-full" icon={<FiSave />}>
              {isBn ? 'চার্জশিট দাখিল করুন' : 'Submit Charge Sheet'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
