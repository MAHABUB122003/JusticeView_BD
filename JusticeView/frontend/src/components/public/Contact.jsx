import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiMapPin, FiSend, FiMessageSquare } from 'react-icons/fi';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function Contact() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    { icon: FiMail, label: 'Email', value: 'contact@justiceview.gov.bd', href: 'mailto:contact@justiceview.gov.bd' },
    { icon: FiPhone, label: isBn ? 'ফোন' : 'Phone', value: '+880 1700-000000', href: 'tel:+8801700000000' },
    { icon: FiMapPin, label: isBn ? 'ঠিকানা' : 'Address', value: isBn ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh' },
  ];

  return (
    <div className="min-h-screen bg-off-white pt-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-justice-blue via-justice-blue-light to-justice-blue">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
            <FiMail className="text-3xl text-justice-gold" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {isBn ? 'যোগাযোগ করুন' : 'Contact Us'}
          </h1>
          <p className="text-white/80 text-sm md:text-lg max-w-xl mx-auto">
            {isBn ? 'আমাদের সাথে যোগাযোগ করতে নিচের ফর্ম ব্যবহার করুন' : 'Use the form below to get in touch with us'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-16">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {contactInfo.map((item, i) => (
            <Card key={i} hover>
              {item.href ? (
                <a href={item.href} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-justice-blue to-justice-blue-light flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="text-xl text-justice-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-gray">{item.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
                  </div>
                </a>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-justice-blue to-justice-blue-light flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-xl text-justice-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-gray">{item.label}</p>
                    <p className="font-semibold text-gray-900 text-sm">{item.value}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card>
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-light-gray/60">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-justice-gold to-yellow-600 flex items-center justify-center">
              <FiMessageSquare className="text-xl text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-justice-blue">{isBn ? 'বার্তা পাঠান' : 'Send a Message'}</h2>
              <p className="text-sm text-dark-gray">{isBn ? 'আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেব' : 'We\'ll respond within 24 hours'}</p>
            </div>
          </div>

          {sent && (
            <div className="bg-green-50 border border-green-200 text-success-green px-5 py-4 rounded-xl mb-6 text-sm flex items-center gap-2">
              ✓ {isBn ? 'আপনার বার্তা পাঠানো হয়েছে। ধন্যবাদ!' : 'Your message has been sent. Thank you!'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'নাম' : 'Name'} *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required
                  className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'বিষয়' : 'Subject'} *</label>
              <input type="text" name="subject" value={form.subject} onChange={handleChange} required
                className="w-full h-12 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{isBn ? 'বার্তা' : 'Message'} *</label>
              <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                className="w-full px-4 py-3 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none resize-none" />
            </div>
            <Button type="submit" variant="primary" size="lg" icon={<FiSend />}>
              {isBn ? 'বার্তা পাঠান' : 'Send Message'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
