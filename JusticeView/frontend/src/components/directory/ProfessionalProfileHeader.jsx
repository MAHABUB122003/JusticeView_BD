import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaMapMarkerAlt, FaIdCard, FaIdBadge, FaClock, FaPhone, FaEnvelope, FaShareAlt } from 'react-icons/fa';
import { getPhotoUrl } from '../../services/api';

export default function ProfessionalProfileHeader({ professional }) {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  const designation = professional.rank || professional.judge_type || professional.magistrate_type || professional.role;

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      {professional.is_verified && (
        <div className="bg-justice-gold text-white px-4 py-2 flex items-center gap-2 text-sm">
          <FaCheckCircle /> {isBn ? 'ভেরিফাইড প্রফেশনাল' : 'Verified Professional'}
        </div>
      )}

      <div className="px-6 pb-6 pt-6 relative">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
              <img
                src={getPhotoUrl(professional.photo) || 'https://via.placeholder.com/128?text=No+Photo'}
                alt={professional.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-justice-navy">
              {isBn && professional.bn_name ? professional.bn_name : professional.name}
            </h1>
            <p className="text-xl text-gray-600">{designation}</p>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-justice-gold" />
                {professional.current_location?.district
                  ? (isBn && professional.current_location.district.name_bn ? professional.current_location.district.name_bn : professional.current_location.district.name)
                  : (isBn ? 'ঠিকানা উল্লেখ নেই' : 'Location not specified')}
              </span>
              {professional.role === 'lawyer' && professional.bar_council_no && (
                <span className="flex items-center gap-1">
                  <FaIdCard className="text-justice-gold" />
                  {isBn ? 'বার কাউন্সিল' : 'Bar Council'}: {professional.bar_council_no}
                </span>
              )}
              {professional.role === 'police_officer' && professional.badge_no && (
                <span className="flex items-center gap-1">
                  <FaIdBadge className="text-justice-gold" />
                  {isBn ? 'ব্যাজ নং' : 'Badge'}: {professional.badge_no}
                </span>
              )}
              <span className="flex items-center gap-1">
                <FaClock className="text-justice-gold" />
                {professional.years_of_experience}+ {isBn ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`tel:${professional.phone}`}
                className="bg-justice-gold text-white px-6 py-2 rounded-lg font-semibold hover:bg-justice-gold-dark transition flex items-center gap-2"
              >
                <FaPhone /> {isBn ? 'যোগাযোগ' : 'Contact'}
              </a>
              <a
                href={`mailto:${professional.email}`}
                className="bg-justice-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-justice-navy transition flex items-center gap-2"
              >
                <FaEnvelope /> {isBn ? 'ইমেইল' : 'Email'}
              </a>
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                className="border-2 border-justice-gold text-justice-gold px-6 py-2 rounded-lg font-semibold hover:bg-justice-gold hover:text-white transition flex items-center gap-2"
              >
                <FaShareAlt /> {isBn ? 'শেয়ার করুন' : 'Share Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
