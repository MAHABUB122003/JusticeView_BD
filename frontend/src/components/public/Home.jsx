import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiShield, FiUsers, FiArrowRight, FiTrendingUp, FiBookOpen, FiCheckCircle, FiSliders } from 'react-icons/fi';
import { analyticsService } from '../../services/analyticsService';
import SearchBar from '../ui/SearchBar';
import StatCard from '../ui/StatCard';

export default function Home() {
  const [stats, setStats] = useState(null);
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  useEffect(() => {
    analyticsService.getDashboard().then(res => setStats(res.data.data)).catch(() => {});
  }, []);

  const features = [
    {
      icon: <FiSearch className="text-2xl" />,
      title: isBn ? 'অপরাধী অনুসন্ধান' : 'Criminal Search',
      desc: isBn ? 'নাম বা এনআইডি দিয়ে যেকোনো অপরাধীর সম্পূর্ণ ইতিহাস দেখুন' : 'Search any criminal by name or NID to see complete history',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <FiSliders className="text-2xl" />,
      title: isBn ? 'মামলা ট্র্যাকিং' : 'Case Tracking',
      desc: isBn ? 'গ্রেফতার থেকে রায় পর্যন্ত প্রতিটি ধাপ অনলাইনে পর্যবেক্ষণ করুন' : 'Track every case from arrest to final verdict online',
      color: 'from-justice-gold to-yellow-600',
    },
    {
      icon: <FiShield className="text-2xl" />,
      title: isBn ? 'স্বচ্ছ বিচার' : 'Transparent Justice',
      desc: isBn ? 'কে কাকে গ্রেফতার করেছে, কে জামিন দিয়েছে তা সবাই দেখতে পারেন' : 'See who arrested whom, who defended, and who granted bail',
      color: 'from-success-green to-green-600',
    },
    {
      icon: <FiUsers className="text-2xl" />,
      title: isBn ? 'জনগণের অংশগ্রহণ' : 'Public Oversight',
      desc: isBn ? 'যেকোনো নাগরিক বিচার ব্যবস্থার তথ্য দেখতে ও বিশ্লেষণ করতে পারেন' : 'Any citizen can view and analyze judicial system data',
      color: 'from-info-blue to-blue-600',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-justice-blue via-justice-blue-light to-justice-blue min-h-[650px] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        </div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-justice-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-justice-gold/10 border border-justice-gold/30 rounded-full text-justice-gold text-sm font-medium mb-8">
              <FiCheckCircle className="text-sm" />
              {isBn ? 'বাংলাদেশের প্রথম স্বচ্ছ বিচার ট্র্যাকিং প্ল্যাটফর্ম' : "Bangladesh's First Transparent Judicial Platform"}
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
              {isBn ? 'প্রত্যেকটি রায়ের' : 'See the Truth Behind'}<br />
              <span className="text-justice-gold">{isBn ? 'পিছনের সত্য দেখুন' : 'Every Verdict'}</span>
            </h1>

            <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              {isBn
                ? 'গ্রেফতার থেকে রায় পর্যন্ত প্রতিটি ফৌজদারি মামলা ট্র্যাক করুন। স্বচ্ছতা নিশ্চিত করুন, জবাবদিহিতা তৈরি করুন।'
                : 'Track every criminal case from arrest to verdict. Ensure transparency, build accountability.'}
            </p>

            <div className="max-w-2xl mx-auto mb-16">
              <SearchBar large />
            </div>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="text-4xl font-extrabold text-justice-gold">{stats.totalCriminals?.toLocaleString() || 0}</div>
                  <div className="text-sm text-white/70 mt-1">{isBn ? 'অপরাধী ট্র্যাক করা হয়েছে' : 'Criminals Tracked'}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="text-4xl font-extrabold text-justice-gold">{stats.totalCases?.toLocaleString() || 0}</div>
                  <div className="text-sm text-white/70 mt-1">{isBn ? 'মামলা নথিভুক্ত' : 'Cases Filed'}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="text-4xl font-extrabold text-justice-gold">{stats.pendingCases?.toLocaleString() || 0}</div>
                  <div className="text-sm text-white/70 mt-1">{isBn ? 'বিচারাধীন মামলা' : 'Pending Cases'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-off-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-justice-blue mb-4">
              {isBn ? 'কীভাবে কাজ করে' : 'How It Works'}
            </h2>
            <p className="text-lg text-dark-gray max-w-2xl mx-auto">
              {isBn ? 'চারটি সহজ ধাপে সম্পূর্ণ স্বচ্ছ বিচার ব্যবস্থা' : 'Complete judicial transparency in four simple steps'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', en: 'Arrest Reported', bn: 'গ্রেফতার রিপোর্ট', icon: <FiShield className="text-2xl" />, desc: isBn ? 'পুলিশ অফিসার গ্রেফতারের তথ্য ও ছবি আপলোড করেন' : 'Officer uploads arrest details with photo' },
              { step: '02', en: 'Case Filed', bn: 'মামলা দায়ের', icon: <FiBookOpen className="text-2xl" />, desc: isBn ? 'মামলার সম্পূর্ণ বিবরণ সিস্টেমে নথিভুক্ত হয়' : 'Full case details recorded in the system' },
              { step: '03', en: 'Bail Process', bn: 'জামিন প্রক্রিয়া', icon: <FiSliders className="text-2xl" />, desc: isBn ? 'জামিনের সব তথ্য উকিল ও বিচারকসহ প্রকাশিত হয়' : 'All bail details published with lawyer and judge info' },
              { step: '04', en: 'Verdict & Tracking', bn: 'রায় ও ট্র্যাকিং', icon: <FiTrendingUp className="text-2xl" />, desc: isBn ? 'যেকোনো নাগরিক মামলার অগ্রগতি অনলাইনে দেখতে পারেন' : 'Any citizen can track case progress online' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-justice-blue to-justice-blue-light rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-justice-gold rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {item.step}
                  </div>
                </div>
                <h4 className="text-lg font-bold text-justice-blue mb-2">{isBn ? item.bn : item.en}</h4>
                <p className="text-sm text-dark-gray">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-justice-blue mb-4">
              {isBn ? 'কেন জাস্টিসভিউ বেছে নেবেন' : 'Why Choose JusticeView'}
            </h2>
            <p className="text-lg text-dark-gray max-w-2xl mx-auto">
              {isBn ? 'আমরা বিচার ব্যবস্থায় স্বচ্ছতা ও জবাবদিহিতা নিশ্চিত করি' : 'We ensure transparency and accountability in the judicial system'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-2 transition-all duration-300 p-8 border border-light-gray/60 group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-justice-blue mb-3">{feature.title}</h3>
                <p className="text-sm text-dark-gray leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-justice-blue via-justice-blue-light to-justice-blue">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            {isBn ? 'আজই শুরু করুন' : 'Get Started Today'}
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            {isBn
              ? 'একটি স্বচ্ছ বাংলাদেশ গড়তে আমাদের সাথে যোগ দিন। আপনার প্রতিটি রিপোর্ট পরিবর্তন আনতে পারে।'
              : 'Join us in building a transparent Bangladesh. Every report you make can drive change.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-justice-gold text-white px-8 py-4 rounded-xl font-bold hover:bg-justice-gold-dark transition-all duration-300 shadow-lg shadow-justice-gold/30 flex items-center gap-2">
              {isBn ? 'নিবন্ধন করুন' : 'Register Now'} <FiArrowRight />
            </Link>
            <Link to="/about" className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
              {isBn ? 'আরও জানুন' : 'Learn More'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
