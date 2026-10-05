import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhone, FaCheckCircle } from 'react-icons/fa';
import { getPhotoUrl } from '../../services/api';

const roleLabels = {
  police_officer: { en: 'Police Officer', bn: 'পুলিশ অফিসার' },
  lawyer: { en: 'Lawyer', bn: 'উকিল' },
  judge: { en: 'Judge', bn: 'বিচারক' },
  magistrate: { en: 'Magistrate', bn: 'ম্যাজিস্ট্রেট' },
  court_official: { en: 'Court Official', bn: 'আদালত কর্মকর্তা' },
};

export default function ProfessionalCard({ professional }) {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <div className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden border border-gray-100 hover:border-justice-gold">
      <div className="relative h-48 bg-gradient-to-br from-justice-blue to-justice-navy">
        <img
          src={getPhotoUrl(professional.photo) || 'https://via.placeholder.com/300x200?text=No+Photo'}
          alt={professional.name}
          className="w-full h-full object-cover object-center"
        />
        {professional.is_verified && (
          <div className="absolute top-4 right-4 bg-justice-gold text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <FaCheckCircle /> {isBn ? 'ভেরিফাইড' : 'Verified'}
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-justice-navy group-hover:text-justice-gold transition">
          {isBn && professional.bn_name ? professional.bn_name : professional.name}
        </h3>

        <p className="text-sm text-gray-600 font-medium">
          {professional.rank || professional.judge_type || professional.magistrate_type || (isBn ? roleLabels[professional.role]?.bn : roleLabels[professional.role]?.en)}
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <FaMapMarkerAlt className="text-justice-gold" />
          <span>
            {professional.current_location?.district
              ? (isBn && professional.current_location.district.name_bn ? professional.current_location.district.name_bn : professional.current_location.district.name)
              : (isBn ? 'উল্লেখ নেই' : 'Not Specified')}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {professional.role === 'lawyer' && (
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
              {professional.lawyer_type === 'government' ? (isBn ? 'সরকারি উকিল' : 'Government') : professional.lawyer_type === 'private' ? (isBn ? 'বেসরকারি উকিল' : 'Private') : (isBn ? 'উভয়' : 'Both')}
            </span>
          )}
          {professional.role === 'police_officer' && professional.rank && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{professional.rank}</span>
          )}
          {professional.role === 'judge' && professional.judge_type && (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">{professional.judge_type}</span>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-justice-navy">{professional.total_cases_handled || 0}</p>
            <p className="text-xs text-gray-500">{isBn ? 'মামলা' : 'Cases'}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-justice-navy">{professional.total_bails_granted || 0}</p>
            <p className="text-xs text-gray-500">{isBn ? 'জামিন' : 'Bails'}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-justice-navy">{professional.years_of_experience || 0}</p>
            <p className="text-xs text-gray-500">{isBn ? 'অভিজ্ঞতা' : 'Experience'}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/directory/${professional._id}`}
            className="flex-1 bg-justice-blue text-white py-2 rounded-lg text-sm font-medium hover:bg-justice-navy transition text-center"
          >
            {isBn ? 'প্রোফাইল দেখুন' : 'View Profile'}
          </Link>
          <a
            href={`tel:${professional.phone}`}
            className="px-3 bg-justice-gold text-white py-2 rounded-lg text-sm font-medium hover:bg-justice-gold-dark transition flex items-center"
          >
            <FaPhone />
          </a>
        </div>
      </div>
    </div>
  );
}
