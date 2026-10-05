import { useTranslation } from 'react-i18next';
import { FiMapPin, FiClock, FiAlertCircle } from 'react-icons/fi';
import Card from '../ui/Card';

export default function DistrictManagement() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-info-blue to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <FiMapPin className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'জেলা ব্যবস্থাপনা' : 'District Management'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'বাংলাদেশের সকল জেলা পরিচালনা' : 'Manage all districts of Bangladesh'}</p>
          </div>
        </div>

        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
              <FiClock className="text-3xl text-justice-gold" />
            </div>
            <h2 className="text-2xl font-bold text-justice-blue mb-2">
              {isBn ? 'শীঘ্রই আসছে' : 'Coming Soon'}
            </h2>
            <p className="text-dark-gray max-w-md text-sm">
              {isBn
                ? 'জেলা ব্যবস্থাপনা বৈশিষ্ট্যটি উন্নয়নাধীন। খুব শীঘ্রই আপনি জেলা সংক্রান্ত তথ্য যোগ, সম্পাদনা এবং পরিচালনা করতে পারবেন।'
                : 'District management feature is under development. Soon you will be able to add, edit and manage district information.'}
            </p>
            <div className="flex items-center gap-2 mt-6 text-xs text-dark-gray bg-gray-50 px-4 py-3 rounded-xl">
              <FiAlertCircle className="text-justice-gold" />
              {isBn ? '৮টি বিভাগ ও ৬৪টি জেলা ইতিমধ্যে সীড করা আছে' : '8 divisions and 64 districts are already seeded'}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
