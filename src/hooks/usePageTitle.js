import { useEffect } from 'react'
import { useLanguage } from './useLanguage'

const pageTitles = {
  sv: {
    home: 'Muscle & Focus | Personlig Träning & Kostrådgivning',
    packages: 'Träningspaket | Muscle & Focus',
    apply: 'Bli Klient | Muscle & Focus',
    bmi: 'BMI-räknare | Muscle & Focus',
    licenses: 'Licenser & Certifikat | Muscle & Focus',
    terms: 'Köpvillkor | Muscle & Focus',
    whyStrength: 'Varför Styrketräna? | Muscle & Focus',
    idealClient: 'Ideal Kund | Muscle & Focus',
    findBuddy: 'Hitta Träningskompis | Muscle & Focus',
    admin: 'Admin | Muscle & Focus',
    notFound: 'Sidan hittades inte | Muscle & Focus',
    paymentSuccess: 'Betalning Mottagen | Muscle & Focus',
    paymentCancel: 'Betalning Avbruten | Muscle & Focus',
  },
  en: {
    home: 'Muscle & Focus | Personal Training & Nutrition',
    packages: 'Training Packages | Muscle & Focus',
    apply: 'Become a Client | Muscle & Focus',
    bmi: 'BMI Calculator | Muscle & Focus',
    licenses: 'Licenses & Certificates | Muscle & Focus',
    terms: 'Terms & Conditions | Muscle & Focus',
    whyStrength: 'Why Strength Training? | Muscle & Focus',
    idealClient: 'Ideal Client | Muscle & Focus',
    findBuddy: 'Find Training Buddy | Muscle & Focus',
    admin: 'Admin | Muscle & Focus',
    notFound: 'Page Not Found | Muscle & Focus',
    paymentSuccess: 'Payment Received | Muscle & Focus',
    paymentCancel: 'Payment Cancelled | Muscle & Focus',
  },
  fa: {
    home: 'Muscle & Focus | تمرین شخصی و مشاوره تغذیه',
    packages: 'بسته‌های تمرینی | Muscle & Focus',
    apply: 'ثبت نام | Muscle & Focus',
    bmi: 'محاسبه‌گر BMI | Muscle & Focus',
    licenses: 'مجوزها و مدرک‌ها | Muscle & Focus',
    terms: 'شرایط و ضوابط | Muscle & Focus',
    whyStrength: 'چرا تمرینات قدرتی؟ | Muscle & Focus',
    idealClient: 'مشتری ایده‌آل | Muscle & Focus',
    findBuddy: 'یافتن هم‌تمرینی | Muscle & Focus',
    admin: 'مدیر | Muscle & Focus',
    notFound: 'صفحه یافت نشد | Muscle & Focus',
    paymentSuccess: 'پرداخت دریافت شد | Muscle & Focus',
    paymentCancel: 'پرداخت لغو شد | Muscle & Focus',
  }
}

const ogDescriptions = {
  sv: 'Premium personlig träning, kostrådgivning och coaching online eller på plats med Lic. PT Ali Wafa.',
  en: 'Premium personal training, nutritional advice and coaching online or on-site with Lic. PT Ali Wafa.',
  fa: 'تمرین شخصی حرفه‌ای، مشاوره تغذیه و مربیگری آنلاین یا حضوری با Lic. PT Ali Wafa.'
}

export function usePageTitle(pageKey) {
  const { language } = useLanguage()

  useEffect(() => {
    const titles = pageTitles[language] || pageTitles['sv']
    const title = titles[pageKey] || titles['home']
    document.title = title

    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]')
    const ogDesc = document.querySelector('meta[property="og:description"]')
    const ogLocale = document.querySelector('meta[property="og:locale"]')

    if (ogTitle) ogTitle.setAttribute('content', title)
    if (ogDesc) ogDesc.setAttribute('content', ogDescriptions[language] || ogDescriptions['sv'])
    if (ogLocale) ogLocale.setAttribute('content', language === 'en' ? 'en_US' : language === 'fa' ? 'fa_IR' : 'sv_SE')

  }, [language, pageKey])
}
