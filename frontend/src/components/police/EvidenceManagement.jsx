import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPackage, FiUpload, FiSearch, FiX, FiCheck, FiSend, FiFileText } from 'react-icons/fi';
import { evidenceService } from '../../services/evidenceService';
import { caseService } from '../../services/caseService';
import { getPhotoUrl } from '../../services/api';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';

export default function EvidenceManagement() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    case: '', evidenceType: 'weapon', evidenceName: '', evidenceDescription: '',
    collectionDate: '', collectionLocation: '',
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [caseResults, setCaseResults] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [searchingCase, setSearchingCase] = useState(false);
  const [caseQuery, setCaseQuery] = useState('');

  const fetchEvidence = () => {
    setLoading(true);
    evidenceService.getAll({ limit: 50 })
      .then(res => setEvidence(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvidence(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (file) formData.append('evidenceUrl', file);
      await evidenceService.create(formData);
      setMessage(isBn ? 'প্রমাণ সফলভাবে রেকর্ড করা হয়েছে' : 'Evidence recorded successfully');
      setShowForm(false);
      setForm({ case: '', evidenceType: 'weapon', evidenceName: '', evidenceDescription: '', collectionDate: '', collectionLocation: '' });
      setFile(null);
      setSelectedCase(null);
      fetchEvidence();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEvidence = async (id) => {
    try {
      await evidenceService.submit(id);
      fetchEvidence();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const handleVerify = async (id) => {
    try {
      await evidenceService.verify(id);
      fetchEvidence();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const evidenceTypes = [
    { value: 'weapon', label: isBn ? 'অস্ত্র' : 'Weapon' },
    { value: 'document', label: isBn ? 'নথি' : 'Document' },
    { value: 'photo', label: isBn ? 'ছবি' : 'Photo' },
    { value: 'video', label: isBn ? 'ভিডিও' : 'Video' },
    { value: 'witness', label: isBn ? 'সাক্ষী' : 'Witness' },
    { value: 'dna', label: 'DNA' },
    { value: 'fingerprint', label: isBn ? 'আঙুলের ছাপ' : 'Fingerprint' },
    { value: 'digital', label: isBn ? 'ডিজিটাল' : 'Digital' },
    { value: 'others', label: isBn ? 'অন্যান্য' : 'Others' },
  ];

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-success-green to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
              <FiPackage className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'প্রমাণ ব্যবস্থাপনা' : 'Evidence Management'}</h1>
              <p className="text-dark-gray text-sm">{isBn ? 'প্রমাণ সংগ্রহ, জমা ও যাচাই করুন' : 'Collect, submit, and verify evidence'}</p>
            </div>
          </div>
          <Button variant="primary" icon={<FiUpload />} onClick={() => setShowForm(!showForm)}>
            {isBn ? 'নতুন প্রমাণ' : 'New Evidence'}
          </Button>
        </div>

        {message && (
          <div className={`px-5 py-4 rounded-xl mb-6 text-sm flex items-center gap-2 border ${
            message.includes('successfully') || message.includes('সফলভাবে')
              ? 'bg-green-50 border-green-200 text-success-green'
              : 'bg-red-50 border-red-200 text-court-red'
          }`}>
            {message.includes('successfully') || message.includes('সফলভাবে') ? '✓' : '⚠'} {message}
          </div>
        )}

        {showForm && (
          <Card className="mb-8">
            <h3 className="text-lg font-bold text-justice-blue mb-5">{isBn ? 'নতুন প্রমাণ রেকর্ড' : 'Record New Evidence'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'মামলা' : 'Case'} *</label>
                  <div className="relative">
                    <FiSearch className="absolute left-4 top-4 text-gray-400" />
                    <input type="text" value={caseQuery} onChange={(e) => {
                      setCaseQuery(e.target.value);
                      if (e.target.value.trim()) {
                        setSearchingCase(true);
                        caseService.search({ q: e.target.value, limit: 10 })
                          .then(r => setCaseResults(r.data.data || []))
                          .catch(() => {}).finally(() => setSearchingCase(false));
                      }
                    }}
                      placeholder={isBn ? 'মামলা নম্বর...' : 'Case number...'}
                      className="w-full h-12 pl-12 pr-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                  </div>
                  {caseResults.length > 0 && (
                    <div className="absolute z-50 mt-1 left-0 right-0 bg-white rounded-xl shadow-xl border border-light-gray/60 max-h-40 overflow-y-auto">
                      {caseResults.map(item => (
                        <button key={item._id} type="button" onClick={() => {
                          setSelectedCase(item);
                          setForm(prev => ({ ...prev, case: item._id }));
                          setCaseQuery(item.caseNumber);
                          setCaseResults([]);
                        }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-off-white transition-colors w-full text-left border-b border-light-gray/40 last:border-b-0">
                          <FiFileText className="text-info-blue" />
                          <span className="text-sm font-semibold">{item.caseNumber}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'প্রমাণের ধরন' : 'Evidence Type'} *</label>
                  <select name="evidenceType" value={form.evidenceType} onChange={(e) => setForm(prev => ({ ...prev, evidenceType: e.target.value }))}
                    className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white">
                    {evidenceTypes.map(et => <option key={et.value} value={et.value}>{et.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'প্রমাণের নাম' : 'Evidence Name'} *</label>
                  <input type="text" name="evidenceName" value={form.evidenceName} onChange={(e) => setForm(prev => ({ ...prev, evidenceName: e.target.value }))} required
                    className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'সংগ্রহের তারিখ' : 'Collection Date'} *</label>
                  <input type="date" name="collectionDate" value={form.collectionDate} onChange={(e) => setForm(prev => ({ ...prev, collectionDate: e.target.value }))} required
                    className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'সংগ্রহের স্থান' : 'Collection Location'}</label>
                  <input type="text" name="collectionLocation" value={form.collectionLocation} onChange={(e) => setForm(prev => ({ ...prev, collectionLocation: e.target.value }))}
                    className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'ফাইল আপলোড' : 'File Upload'}</label>
                  <input type="file" onChange={(e) => setFile(e.target.files[0])}
                    className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-justice-gold file:text-white hover:file:bg-justice-gold-dark" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'প্রমাণের বিবরণ' : 'Evidence Description'}</label>
                <textarea name="evidenceDescription" value={form.evidenceDescription} onChange={(e) => setForm(prev => ({ ...prev, evidenceDescription: e.target.value }))} rows={3}
                  className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
              </div>

              <div className="flex gap-3">
                <Button type="submit" loading={submitting} variant="primary" icon={<FiUpload />}>
                  {isBn ? 'প্রমাণ রেকর্ড করুন' : 'Record Evidence'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  {isBn ? 'বাতিল' : 'Cancel'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card>
          {loading ? (
            <div className="py-12 flex justify-center"><Spinner size="lg" /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-justice-gold/5 to-transparent border-b border-light-gray/60">
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'প্রমাণের নাম' : 'Evidence'}</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'ধরন' : 'Type'}</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'মামলা' : 'Case'}</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'সংগ্রহের তারিখ' : 'Date'}</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'অবস্থা' : 'Status'}</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">{isBn ? 'কর্ম' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-gray/40">
                  {evidence.map((item) => (
                    <tr key={item._id} className="hover:bg-justice-gold/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.evidenceName}</td>
                      <td className="px-6 py-4"><Badge variant="normal">{item.evidenceType}</Badge></td>
                      <td className="px-6 py-4 text-sm text-justice-blue">{item.case?.caseNumber || '-'}</td>
                      <td className="px-6 py-4 text-sm text-dark-gray">{new Date(item.collectionDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {item.isSubmitted && <Badge variant="disposed">{isBn ? 'জমা' : 'Submitted'}</Badge>}
                          {item.isVerified && <Badge variant="active">{isBn ? 'যাচাই' : 'Verified'}</Badge>}
                          {!item.isSubmitted && !item.isVerified && <Badge variant="pending">{isBn ? 'বিচারাধীন' : 'Pending'}</Badge>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {!item.isSubmitted && (
                            <button onClick={() => handleSubmitEvidence(item._id)}
                              className="p-2 rounded-lg bg-blue-50 text-info-blue hover:bg-blue-100 transition-colors" title={isBn ? 'আদালতে জমা দিন' : 'Submit to Court'}>
                              <FiSend className="text-sm" />
                            </button>
                          )}
                          {!item.isVerified && (
                            <button onClick={() => handleVerify(item._id)}
                              className="p-2 rounded-lg bg-green-50 text-success-green hover:bg-green-100 transition-colors" title={isBn ? 'যাচাই করুন' : 'Verify'}>
                              <FiCheck className="text-sm" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {evidence.length === 0 && (
                    <tr><td colSpan="6" className="px-6 py-12 text-center text-dark-gray">{isBn ? 'কোন প্রমাণ পাওয়া যায়নি' : 'No evidence found'}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
