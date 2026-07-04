import { useTranslation } from 'react-i18next';
import { FiShield, FiEye, FiUsers, FiTrendingUp, FiBookOpen, FiAward } from 'react-icons/fi';

const features = [
  { icon: FiEye, en: 'Complete Transparency', bn: 'সম্পূর্ণ স্বচ্ছতা', descEn: 'Every case tracked from arrest to final verdict with full public visibility', descBn: 'গ্রেফতার থেকে রায় পর্যন্ত প্রতিটি মামলা জনসমক্ষে ট্র্যাক করা হয়' },
  { icon: FiShield, en: 'Role-Based Access', bn: 'ভূমিকা ভিত্তিক প্রবেশাধিকার', descEn: 'Police, court, and admin dashboards with appropriate permissions', descBn: 'পুলিশ, আদালত ও অ্যাডমিনের জন্য পৃথক ড্যাশবোর্ড' },
  { icon: FiUsers, en: 'Bilingual Platform', bn: 'দ্বিভাষিক প্ল্যাটফর্ম', descEn: 'Full English and Bengali support for accessibility across Bangladesh', descBn: 'সারাদেশে ব্যবহারের জন্য ইংরেজি ও বাংলা ভাষায় সম্পূর্ণ সাপোর্ট' },
  { icon: FiBookOpen, en: 'Bail Tracking', bn: 'জামিন ট্র্যাকিং', descEn: 'Complete bail records with lawyer, judge, and hearing information', descBn: 'উকিল, বিচারক ও শুনানির তথ্যসহ সম্পূর্ণ জামিন রেকর্ড' },
  { icon: FiTrendingUp, en: 'Analytics & Insights', bn: ' বিশ্লেষণ ও অন্তর্দৃষ্টি', descEn: 'Data-driven insights into case trends and judicial efficiency', descBn: 'মামলার প্রবণতা ও বিচারিক দক্ষতার ডেটা-চালিত বিশ্লেষণ' },
  { icon: FiAward, en: 'Public Trust', bn: 'জনগণের আস্থা', descEn: 'Building trust through transparency in the justice system', descBn: 'বিচার ব্যবস্থায় স্বচ্ছতার মাধ্যমে আস্থা তৈরি' },
];

export default function About() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  return (
    <div className="min-h-screen bg-off-white pt-24">
      {/* Hero */}
      <div className="bg-gradient-to-r from-justice-blue via-justice-blue-light to-justice-blue">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
            <FiShield className="text-3xl text-justice-gold" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {isBn ? 'জাস্টিসভিউ সম্পর্কে' : 'About JusticeView'}
          </h1>
          <p className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? 'বাংলাদেশের বিচার ব্যবস্থায় স্বচ্ছতা ও জবাবদিহিতা আনার জন্য একটি বিপ্লবী ডিজিটাল প্ল্যাটফর্ম'
              : 'A revolutionary digital platform bringing transparency and accountability to Bangladesh\'s judicial system'}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Mission */}
        <div className="bg-white rounded-2xl shadow-card border border-light-gray/60 p-6 md:p-10 mb-10">
          <h2 className="text-2xl font-extrabold text-justice-blue mb-4">{isBn ? 'আমাদের লক্ষ্য' : 'Our Mission'}</h2>
          <p className="text-dark-gray leading-relaxed text-sm md:text-base">
            {isBn
              ? 'আমাদের লক্ষ্য হলো সাধারণ নাগরিকদের বিচার ব্যবস্থা সম্পর্কে সম্পূর্ণ তথ্য প্রদান করা, যাতে তারা জানতে পারেন কে কাকে গ্রেফতার করেছে, কে কাকে ডিফেন্ড করেছে এবং কে জামিন দিয়েছে। আমরা বিশ্বাস করি স্বচ্ছতাই হলো সুবিচারের ভিত্তি।'
              : 'Our mission is to provide ordinary citizens with complete information about the judicial system, so they can know who arrested whom, who defended whom, and who granted bail. We believe transparency is the foundation of justice.'}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-card border border-light-gray/60 p-6 hover:border-justice-gold/30 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-justice-blue to-justice-blue-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="text-xl text-justice-gold" />
              </div>
              <h3 className="text-lg font-bold text-justice-blue mb-2">{isBn ? f.bn : f.en}</h3>
              <p className="text-sm text-dark-gray leading-relaxed">{isBn ? f.descBn : f.descEn}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
