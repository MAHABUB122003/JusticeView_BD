import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiCamera, FiUpload, FiSearch, FiX, FiUser, FiChevronRight, FiAlertCircle } from 'react-icons/fi';
import { imageSearchService } from '../../services/imageSearchService';
import { getPhotoUrl } from '../../services/api';
import { loadFaceModels, detectFace } from '../../services/faceDetection';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function ImageSearch() {
  const { t, i18n } = useTranslation('common');
  const isBn = i18n.language === 'bn';

  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [statusText, setStatusText] = useState('');
  const imgRef = useRef(null);

  useEffect(() => {
    loadFaceModels();
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(isBn ? 'ছবির আকার ৫এমবির বেশি হতে পারবে না' : 'Image size must be under 5MB');
      return;
    }
    setUploadedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
    setResults([]);
    setHasSearched(false);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleSearch = async () => {
    if (!uploadedImage) {
      setError(isBn ? 'দয়া করে একটি ছবি আপলোড করুন' : 'Please upload an image first');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setError(null);
    setStatusText(isBn ? 'ছবি বিশ্লেষণ করা হচ্ছে...' : 'Analyzing image...');

    try {
      const face = await detectFace(imgRef.current);
      if (!face) {
        setError(isBn ? 'ছবিতে কোনো মুখ সনাক্ত করা যায়নি। অন্য ছবি দিয়ে চেষ্টা করুন।' : 'No face detected. Try another image.');
        setIsLoading(false);
        setStatusText('');
        return;
      }
      setStatusText(isBn ? 'মিল খোঁজা হচ্ছে...' : 'Searching for matches...');
      const res = await imageSearchService.searchByDescriptor({
        descriptor: face.descriptor,
      });
      if (res.data.success) {
        setResults(res.data.data.matches || []);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || (isBn ? 'ছবি অনুসন্ধানে ত্রুটি' : 'Error searching image'));
    } finally {
      setIsLoading(false);
      setStatusText('');
    }
  };

  const handleReset = () => {
    setUploadedImage(null);
    setPreviewUrl(null);
    setResults([]);
    setHasSearched(false);
    setError(null);
  };

  const getSimilarityColor = (level) => {
    switch (level) {
      case 'high': return 'text-success-green bg-green-50 border-green-200';
      case 'medium': return 'text-justice-gold bg-yellow-50 border-yellow-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-off-white pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-justice-blue to-justice-blue-light rounded-2xl flex items-center justify-center shadow-lg">
            <FiCamera className="text-2xl text-justice-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-justice-blue">
              {isBn ? 'ছবি দিয়ে অপরাধী অনুসন্ধান' : 'Face Recognition Search'}
            </h1>
            <p className="text-dark-gray text-sm">
              {isBn ? 'ছবি আপলোড করে অপরাধী সনাক্ত করুন' : 'Upload a photo to identify criminals using AI'}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                  dragOver
                    ? 'border-justice-gold bg-justice-gold/5'
                    : previewUrl
                      ? 'border-success-green bg-green-50/50'
                      : 'border-light-gray hover:border-justice-gold/50 bg-gray-50/50'
                }`}
              >
                {previewUrl ? (
                  <div className="relative">
                    <img ref={imgRef} src={previewUrl} alt="Preview"
                      className="w-48 h-48 mx-auto rounded-2xl object-cover shadow-lg" crossOrigin="anonymous" />
                    <button type="button" onClick={handleReset}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-court-red text-white rounded-full text-xs font-bold hover:bg-court-red-dark flex items-center justify-center shadow-md">
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUpload className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {isBn ? 'ছবি আপলোড করুন' : 'Upload a photo'}
                    </p>
                    <p className="text-xs text-dark-gray mb-4">
                      {isBn ? 'JPG, PNG, WEBP (সর্বোচ্চ ৫এমবি)' : 'JPG, PNG, WEBP (Max 5MB)'}
                    </p>
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-justice-gold text-white rounded-xl font-bold text-sm hover:bg-justice-gold-dark transition-all shadow-md cursor-pointer">
                      <FiUpload /> {isBn ? 'ছবি নির্বাচন' : 'Choose Image'}
                      <input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {previewUrl && (
                <Button
                  onClick={handleSearch}
                  loading={isLoading}
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  icon={<FiSearch />}
                >
                  {isBn ? 'অনুসন্ধান করুন' : 'Search'}
                </Button>
              )}

              {error && (
                <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-court-red">
                  <FiAlertCircle className="flex-shrink-0" />
                  {error}
                </div>
              )}
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {!hasSearched ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCamera className="text-4xl text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {isBn ? 'ছবি আপলোড করে অনুসন্ধান শুরু করুন' : 'Upload an image to start search'}
                  </h3>
                  <p className="text-sm text-dark-gray max-w-md mx-auto">
                    {isBn
                      ? 'সিস্টেম এআই ব্যবহার করে আপলোড করা ছবির সাথে ডাটাবেসের অপরাধীদের মিল খুঁজে বের করবে'
                      : 'The system uses AI to match the uploaded photo against criminal records in the database'}
                  </p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-12">
                  <svg className="animate-spin h-12 w-12 text-justice-gold mx-auto mb-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-sm text-dark-gray">
                    {statusText || (isBn ? 'ছবি বিশ্লেষণ করা হচ্ছে...' : 'Analyzing image...')}
                  </p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiUser className="text-4xl text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {isBn ? 'কোনো মিল পাওয়া যায়নি' : 'No matches found'}
                  </h3>
                  <p className="text-sm text-dark-gray">
                    {isBn ? 'অন্য একটি ছবি দিয়ে চেষ্টা করুন' : 'Try with a different image'}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-justice-blue">
                    {isBn ? `${results.length}টি মিল পাওয়া গেছে` : `${results.length} match${results.length > 1 ? 'es' : ''} found`}
                  </h2>
                </div>

                <div className="space-y-4">
                  {results.map((match, index) => (
                    <div key={match.face_id} className="bg-white rounded-xl border border-light-gray/80 shadow-sm hover:shadow-md transition-all overflow-hidden">
                      <div className="p-4 sm:p-5 flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden">
                            {match.criminal?.photo ? (
                              <img src={getPhotoUrl(match.criminal.photo)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiUser className="text-xl" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link to={`/criminal/${match.criminal?._id}`} className="text-base font-bold text-justice-blue hover:text-justice-gold transition-colors">
                            {isBn && match.criminal?.name_bn ? match.criminal.name_bn : match.criminal?.name || 'Unknown'}
                          </Link>
                          {match.criminal?.nid && (
                            <p className="text-xs text-dark-gray mt-0.5">NID: {match.criminal.nid}</p>
                          )}
                          {match.criminal?.fatherName && (
                            <p className="text-xs text-dark-gray">{isBn ? 'পিতা: ' : 'Father: '}{match.criminal.fatherName}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getSimilarityColor(match.similarity_level)}`}>
                              {match.similarity}% {isBn ? 'মিল' : 'match'}
                            </span>
                            <span className="text-xs text-dark-gray">
                              {match.criminal?.totalCases || 0} {isBn ? 'মামলা' : 'cases'}
                            </span>
                          </div>
                        </div>

                        <Link to={`/criminal/${match.criminal?._id}`}
                          className="flex-shrink-0 w-9 h-9 rounded-lg bg-off-white flex items-center justify-center text-justice-gold hover:bg-justice-gold hover:text-white transition-all">
                          <FiChevronRight />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
