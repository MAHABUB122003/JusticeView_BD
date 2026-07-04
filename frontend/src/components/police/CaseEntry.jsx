import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiBook, FiSave, FiUsers, FiSearch, FiX, FiShield, FiMapPin } from 'react-icons/fi';
import { caseService } from '../../services/caseService';
import { criminalService } from '../../services/criminalService';
import { policeOfficerService } from '../../services/policeOfficerService';
import { thanaService } from '../../services/thanaService';
import { districtService } from '../../services/divisionService';
import { getPhotoUrl } from '../../services/api';
import Button from '../ui/Button';
import Card from '../ui/Card';

function SearchSelect({ label, placeholder, value, onChange, onSearch, results, searching, selectedItem, onSelect, onClear, icon: Icon, renderItem, onTextChange }) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef(null);
  const timeout = useRef(null);

  useEffect(() => {
    if (selectedItem) {
      setQuery(selectedItem.name || selectedItem.badgeNumber || '');
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
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label} *</label>
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
            <button key={item._id} type="button" onClick={() => { onSelect(item); setShowDropdown(false); setQuery(item.name || item.badgeNumber || ''); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-off-white transition-colors w-full text-left border-b border-light-gray/40 last:border-b-0">
              {renderItem(item, false)}
            </button>
          ))}
        </div>
      )}

      {showDropdown && query.trim() && !searching && results.length === 0 && (
        <div className="absolute z-50 mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-light-gray/60 p-3 text-center">
          <p className="text-sm text-dark-gray mb-2">No results found</p>
          {query.trim().length >= 3 && (
            <button type="button" onClick={() => { onSelect({ _id: query.trim(), name: query.trim() }); setShowDropdown(false); }}
              className="text-sm font-semibold text-justice-blue hover:text-justice-gold transition-colors">
              Use "{query.trim()}" as ID
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CaseEntry() {
  const [searchParams] = useSearchParams();
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  const [form, setForm] = useState({
    caseNumber: '', criminal: searchParams.get('criminalId') || '',
    arrestingOfficer: '', thana: '',
    arrestDate: '', arrestTime: '', sectionLaw: '', description: '', description_bn: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [criminalResults, setCriminalResults] = useState([]);
  const [officerResults, setOfficerResults] = useState([]);
  const [searchingCriminal, setSearchingCriminal] = useState(false);
  const [searchingOfficer, setSearchingOfficer] = useState(false);

  const [selectedCriminal, setSelectedCriminal] = useState(null);
  const [selectedOfficer, setSelectedOfficer] = useState(null);

  const [districts, setDistricts] = useState([]);
  const [thanas, setThanas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingThanas, setLoadingThanas] = useState(false);

  const criminalIdFromUrl = searchParams.get('criminalId');

  useEffect(() => {
    if (criminalIdFromUrl) {
      criminalService.getById(criminalIdFromUrl)
        .then(res => { const c = res.data.data; setSelectedCriminal(c); setForm(prev => ({ ...prev, criminal: c._id })); })
        .catch(() => {});
    }
  }, [criminalIdFromUrl]);

  useEffect(() => {
    setLoadingDistricts(true);
    districtService.getAll()
      .then(res => setDistricts(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoadingDistricts(false));
  }, []);

  useEffect(() => {
    if (!selectedDistrict) { setThanas([]); return; }
    setLoadingThanas(true);
    thanaService.getByDistrict(selectedDistrict)
      .then(res => setThanas(res.data.data || []))
      .catch(() => setThanas([]))
      .finally(() => setLoadingThanas(false));
  }, [selectedDistrict]);

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setForm(prev => ({ ...prev, thana: '' }));
    clearFieldError('thana');
  };

  const handleThanaChange = (e) => {
    setForm(prev => ({ ...prev, thana: e.target.value }));
    clearFieldError('thana');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setFieldErrors({});
    try {
      await caseService.create(form);
      setMessage(isBn ? 'মামলা সফলভাবে তৈরি হয়েছে' : 'Case created successfully');
      setForm({ caseNumber: '', criminal: '', arrestingOfficer: '', thana: '', arrestDate: '', arrestTime: '', sectionLaw: '', description: '', description_bn: '' });
      setSelectedCriminal(null); setSelectedOfficer(null); setSelectedDistrict(''); setThanas([]);
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

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const clearFieldError = (field) => setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-justice-blue to-justice-blue-light rounded-2xl flex items-center justify-center shadow-lg">
            <FiBook className="text-2xl text-justice-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'নতুন মামলা এন্ট্রি' : 'New Case Entry'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'মামলার সম্পূর্ণ তথ্য রেকর্ড করুন' : 'Record complete case information'}</p>
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
              {/* Case Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'মামলা নম্বর' : 'Case Number'} *</label>
                <input type="text" name="caseNumber" value={form.caseNumber} onChange={handleChange} required
                  className={`w-full h-12 px-4 border-2 rounded-xl focus:ring-4 transition-all text-sm outline-none ${fieldErrors.caseNumber ? 'border-court-red focus:ring-red-200' : 'border-light-gray focus:border-justice-gold focus:ring-justice-gold/20'}`} />
                {fieldErrors.caseNumber && <p className="text-xs text-court-red mt-1">{fieldErrors.caseNumber}</p>}
              </div>

              {/* Criminal Search */}
              <div>
                <SearchSelect
                  label={isBn ? 'অপরাধী' : 'Criminal'}
                  placeholder={isBn ? 'নাম, NID বা আইডি লিখুন...' : 'Type name, NID, or ID...'}
                  value={form.criminal}
                  selectedItem={selectedCriminal}
                  onSelect={(item) => { setSelectedCriminal(item); setForm(prev => ({ ...prev, criminal: item._id })); clearFieldError('criminal'); }}
                  onClear={() => { setSelectedCriminal(null); setForm(prev => ({ ...prev, criminal: '' })); }}
                  onSearch={(q) => { setSearchingCriminal(true); criminalService.search({ q, limit: 10 }).then(r => setCriminalResults(r.data.data || [])).catch(() => {}).finally(() => setSearchingCriminal(false)); }}
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
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-info-blue font-medium whitespace-nowrap">{item.totalCases || 0} {isBn ? 'মামলা' : 'cases'}</span>
                    </>
                  )}
                />
                {fieldErrors.criminal && <p className="text-xs text-court-red mt-1">{fieldErrors.criminal}</p>}
              </div>

              {/* Arresting Officer Search */}
              <div>
                <SearchSelect
                  label={isBn ? 'গ্রেফতারকারী অফিসার' : 'Arresting Officer'}
                  placeholder={isBn ? 'নাম, ব্যাজ নং বা আইডি...' : 'Type name, badge, or ID...'}
                  value={form.arrestingOfficer}
                  selectedItem={selectedOfficer}
                  onSelect={(item) => { setSelectedOfficer(item); setForm(prev => ({ ...prev, arrestingOfficer: item._id })); clearFieldError('arrestingOfficer'); }}
                  onClear={() => { setSelectedOfficer(null); setForm(prev => ({ ...prev, arrestingOfficer: '' })); }}
                  onTextChange={(text) => setForm(prev => ({ ...prev, arrestingOfficer: text }))}
                  onSearch={(q) => { setSearchingOfficer(true); policeOfficerService.search({ q }).then(r => setOfficerResults(r.data.data || [])).catch(() => {}).finally(() => setSearchingOfficer(false)); }}
                  results={officerResults}
                  searching={searchingOfficer}
                  icon={FiShield}
                  renderItem={(item, selected) => (
                    <>
                      <div className="w-9 h-9 rounded-lg bg-justice-blue/5 flex items-center justify-center text-justice-blue flex-shrink-0">
                        <FiShield className="text-sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${selected ? 'text-success-green' : 'text-gray-900'}`}>{item.name}</p>
                        <p className="text-xs text-dark-gray truncate">{item.designation} • {item.badgeNumber}</p>
                      </div>
                    </>
                  )}
                />
                {fieldErrors.arrestingOfficer && <p className="text-xs text-court-red mt-1">{fieldErrors.arrestingOfficer}</p>}
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'জেলা' : 'District'} *</label>
                <select
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white"
                >
                  <option value="">{isBn ? 'জেলা নির্বাচন করুন' : 'Select District'}</option>
                  {districts.map(d => (
                    <option key={d._id} value={d._id}>{isBn && d.name_bn ? d.name_bn : d.name}</option>
                  ))}
                </select>
              </div>

              {/* Thana */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'থানা' : 'Thana'} *</label>
                <select
                  value={form.thana}
                  onChange={handleThanaChange}
                  disabled={!selectedDistrict}
                  className={`w-full h-12 px-4 border-2 rounded-xl focus:ring-4 transition-all text-sm outline-none bg-white ${fieldErrors.thana ? 'border-court-red focus:ring-red-200' : 'border-light-gray focus:border-justice-gold focus:ring-justice-gold/20'} ${!selectedDistrict ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="">{loadingThanas ? (isBn ? 'লোড হচ্ছে...' : 'Loading...') : (isBn ? 'থানা নির্বাচন করুন' : 'Select Thana')}</option>
                  {thanas.map(t => (
                    <option key={t._id} value={t._id}>{isBn && t.name_bn ? t.name_bn : t.name}</option>
                  ))}
                </select>
                {fieldErrors.thana && <p className="text-xs text-court-red mt-1">{fieldErrors.thana}</p>}
              </div>

              {/* Arrest Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'গ্রেফতার তারিখ' : 'Arrest Date'} *</label>
                <input type="date" name="arrestDate" value={form.arrestDate} onChange={handleChange} required
                  className={`w-full h-12 px-4 border-2 rounded-xl focus:ring-4 transition-all text-sm outline-none ${fieldErrors.arrestDate ? 'border-court-red focus:ring-red-200' : 'border-light-gray focus:border-justice-gold focus:ring-justice-gold/20'}`} />
                {fieldErrors.arrestDate && <p className="text-xs text-court-red mt-1">{fieldErrors.arrestDate}</p>}
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'সময়' : 'Time'}</label>
                <input type="time" name="arrestTime" value={form.arrestTime} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>

              {/* Section of Law */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'ধারা' : 'Section of Law'}</label>
                <input type="text" name="sectionLaw" value={form.sectionLaw} onChange={handleChange}
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'বর্ণনা (ইংরেজি)' : 'Description (English)'}</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'বর্ণনা (বাংলা)' : 'Description (Bengali)'}</label>
              <textarea name="description_bn" value={form.description_bn} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
            </div>

            <Button type="submit" loading={loading} variant="primary" size="lg" className="w-full" icon={<FiSave />}>
              {isBn ? 'মামলা তৈরি করুন' : 'Create Case'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
