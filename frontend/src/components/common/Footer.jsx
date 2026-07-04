import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';

export default function Footer() {
  const { t, i18n } = useTranslation('common');
  const year = new Date().getFullYear();
  const isBn = i18n.language === 'bn';

  const quickLinks = [
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/how-it-works', label: t('nav.howItWorks') },
    { to: '/search', label: t('nav.search') },
  ];

  const legalLinks = [
    { to: '/privacy', label: t('footer.privacy') },
    { to: '/terms', label: t('footer.terms') },
  ];

  return (
    <footer className="bg-gradient-to-b from-justice-blue to-[#050F2A] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-justice-gold rounded-lg flex items-center justify-center font-bold text-justice-blue">JV</div>
              <span className="text-xl font-extrabold text-justice-gold">JusticeView</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('app.tagline')}
            </p>
            <div className="flex gap-3">
              {[FiGithub, FiTwitter, FiLinkedin, FiMail].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-justice-gold hover:text-white transition-all duration-300">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-justice-gold uppercase tracking-wider mb-5">
              {isBn ? 'দ্রুত লিংক' : 'Quick Links'}
            </h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link key={link.to} to={link.to} className="block text-sm text-gray-400 hover:text-justice-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-justice-gold uppercase tracking-wider mb-5">
              {isBn ? 'আইনি' : 'Legal'}
            </h4>
            <div className="space-y-3">
              {legalLinks.map((link) => (
                <Link key={link.to} to={link.to} className="block text-sm text-gray-400 hover:text-justice-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-justice-gold uppercase tracking-wider mb-5">
              {isBn ? 'যোগাযোগ' : 'Contact'}
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p>{isBn ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}</p>
              <p className="hover:text-justice-gold transition-colors">
                <a href="mailto:contact@justiceview.gov.bd">contact@justiceview.gov.bd</a>
              </p>
              <p>+880 1700-000000</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {year} JusticeView. {t('footer.rights')}
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-justice-gold transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-justice-gold transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
