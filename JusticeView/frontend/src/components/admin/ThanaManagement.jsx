import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiShield, FiMapPin, FiRefreshCw, FiPlus } from 'react-icons/fi';
import Card from '../ui/Card';
import { thanaService } from '../../services/thanaService';
import { districtService } from '../../services/divisionService';

export default function ThanaManagement() {
  const { i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  const [thanas, setThanas] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    districtService.getAll()
      .then(res => setDistricts(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = selectedDistrict ? { district: selectedDistrict } : {};
    thanaService.getAll(params)
      .then(res => setThanas(res.data.data || []))
      .catch(() => setThanas([]))
      .finally(() => setLoading(false));
  }, [selectedDistrict]);

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-justice-blue to-justice-blue-light rounded-2xl flex items-center justify-center shadow-lg">
            <FiShield className="text-2xl text-justice-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">{isBn ? 'থানা ব্যবস্থাপনা' : 'Thana Management'}</h1>
            <p className="text-dark-gray text-sm">{isBn ? 'বাংলাদেশের সকল থানা পরিচালনা' : 'Manage all thanas of Bangladesh'}</p>
          </div>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FiMapPin className="text-justice-gold text-lg" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="h-10 px-4 border-2 border-light-gray rounded-xl focus:border-justice-gold focus:ring-4 focus:ring-justice-gold/20 transition-all text-sm outline-none bg-white"
              >
                <option value="">{isBn ? 'সকল জেলা' : 'All Districts'}</option>
                {districts.map(d => (
                  <option key={d._id} value={d._id}>
                    {isBn && d.name_bn ? d.name_bn : d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-dark-gray">
                {isBn ? 'মোট' : 'Total'}: {thanas.length}
              </span>
              <button
                onClick={() => setSelectedDistrict(prev => prev)}
                className="p-2 text-gray-400 hover:text-justice-blue transition-colors"
              >
                <FiRefreshCw className={`text-lg ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-justice-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-light-gray/60">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{isBn ? 'নাম (ইংরেজি)' : 'Name (English)'}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{isBn ? 'নাম (বাংলা)' : 'Name (Bengali)'}</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">{isBn ? 'জেলা' : 'District'}</th>
                  </tr>
                </thead>
                <tbody>
                  {thanas.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-dark-gray">
                        {isBn ? 'কোনো থানা পাওয়া যায়নি' : 'No thanas found'}
                      </td>
                    </tr>
                  ) : (
                    thanas.map((t, i) => (
                      <tr key={t._id} className="border-b border-light-gray/40 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 text-dark-gray">{i + 1}</td>
                        <td className="py-3 px-4 font-medium text-gray-800">{t.name}</td>
                        <td className="py-3 px-4">{t.name_bn}</td>
                        <td className="py-3 px-4 text-dark-gray">
                          {isBn && t.district?.name_bn ? t.district.name_bn : t.district?.name || '-'}
                        </td>
                      </tr>
                    ))
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
