import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiBookOpen, FiSave, FiShield } from 'react-icons/fi';
import { bailService } from '../../services/bailService';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function BailEntry() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [form, setForm] = useState({
    case: '', criminal: '', lawyer: '', judge: '', bailDate: '',
    bailAmount: '', conditions: [], hearingDate: '', nextHearingDate: '',
    notes: '', notes_bn: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await bailService.create({ ...form, bailAmount: parseFloat(form.bailAmount) || 0 });
      setMessage(isBn ? 'জামিন রেকর্ড সফলভাবে তৈরি হয়েছে' : 'Bail record created successfully');
      setForm({ case: '', criminal: '', lawyer: '', judge: '', bailDate: '', bailAmount: '', conditions: [], hearingDate: '', nextHearingDate: '', notes: '', notes_bn: '' });
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
            <div className={`px-5 py-4 rounded-xl mb-6 text-sm flex items-center gap-2 border ${message.includes('successfully') || message.includes('সফলভাবে') ? 'bg-green-50 border-green-200 text-success-green' : 'bg-red-50 border-red-200 text-court-red'}`}>
              {message.includes('successfully') || message.includes('সফলভাবে') ? '✓' : '⚠'} {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Case ID *</label>
                <input type="text" name="case" value={form.case} onChange={handleChange} required className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Criminal ID *</label>
                <input type="text" name="criminal" value={form.criminal} onChange={handleChange} required className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'উকিল আইডি' : 'Lawyer ID'}</label>
                <input type="text" name="lawyer" value={form.lawyer} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'বিচারক আইডি' : 'Judge ID'}</label>
                <input type="text" name="judge" value={form.judge} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'জামিনের তারিখ' : 'Bail Date'} *</label>
                <input type="date" name="bailDate" value={form.bailDate} onChange={handleChange} required className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'জামিনের পরিমাণ' : 'Bail Amount'}</label>
                <input type="number" name="bailAmount" value={form.bailAmount} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" placeholder="৳" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'শুনানির তারিখ' : 'Hearing Date'}</label>
                <input type="date" name="hearingDate" value={form.hearingDate} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'পরবর্তী শুনানি' : 'Next Hearing'}</label>
                <input type="date" name="nextHearingDate" value={form.nextHearingDate} onChange={handleChange} className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'নোট (ইংরেজি)' : 'Notes (English)'}</label>
              <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'নোট (বাংলা)' : 'Notes (Bengali)'}</label>
              <textarea name="notes_bn" value={form.notes_bn} onChange={handleChange} rows={3} className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
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
