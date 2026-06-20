import { useEffect } from 'react'
import { useLanguage } from './useLanguage'

const pageTitles = {
  sv: {
    home: 'Muscle & Focus | Personlig Tränare, Online Coach & Kostrådgivning',
    packages: 'Träningspaket | Din Personliga Tränare Online | Muscle & Focus',
    apply: 'Bli Klient | Skräddarsydd Personlig Träning Online | Muscle & Focus',
    bmi: 'BMI-räknare | Räkna ut BMI & Viktklass | Muscle & Focus',
    licenses: 'Licenser & Certifikat | Certifierad Personlig Tränare | Muscle & Focus',
    terms: 'Köpvillkor & Information | Muscle & Focus',
    whyStrength: 'Varför Styrketräna? Fördelar för Kropp & Sinne | Muscle & Focus',
    idealClient: 'Ideal Kund & Coachningsprofil | Muscle & Focus',
    findBuddy: 'Hitta Träningskompis Online | Muscle & Focus',
    admin: 'Admin Dashboard | Muscle & Focus',
    notFound: 'Sidan hittades inte | Muscle & Focus',
    paymentSuccess: 'Betalning Mottagen | Tack för ditt köp | Muscle & Focus',
    paymentCancel: 'Betalning Avbruten | Muscle & Focus',
  },
  en: {
    home: 'Muscle & Focus | Personal Trainer, Online Coach & Nutritionist',
    packages: 'Training Packages | Personal Training & Coaching | Muscle & Focus',
    apply: 'Become a Client | Personal Trainer Online | Muscle & Focus',
    bmi: 'BMI Calculator | Health & Weight Class | Muscle & Focus',
    licenses: 'Licenses & Certificates | Certified Personal Trainer | Muscle & Focus',
    terms: 'Terms & Conditions | Muscle & Focus',
    whyStrength: 'Why Strength Training? Benefits for Body & Mind | Muscle & Focus',
    idealClient: 'Ideal Client Profile | Muscle & Focus',
    findBuddy: 'Find Training Buddy Online | Muscle & Focus',
    admin: 'Admin Dashboard | Muscle & Focus',
    notFound: 'Page Not Found | Muscle & Focus',
    paymentSuccess: 'Payment Received | Thank you for your purchase | Muscle & Focus',
    paymentCancel: 'Payment Cancelled | Muscle & Focus',
  },
  fa: {
    home: 'Muscle & Focus | مربی شخصی (PT)، مربی آنلاین و مشاوره تغذیه',
    packages: 'بسته‌های تمرینی و برنامه‌ها | Muscle & Focus',
    apply: 'ثبت نام و شروع تمرین | Muscle & Focus',
    bmi: 'محاسبه‌گر BMI و شاخص توده بدنی | Muscle & Focus',
    licenses: 'مجوزها و مدرک‌های رسمی مربیگری | Muscle & Focus',
    terms: 'شرایط و قوانین خرید | Muscle & Focus',
    whyStrength: 'چرا تمرینات قدرتی؟ فواید برای ذهن و بدن | Muscle & Focus',
    idealClient: 'مشتری ایده‌آل و مشخصات | Muscle & Focus',
    findBuddy: 'یافتن هم‌تمرینی آنلاین | Muscle & Focus',
    admin: 'داشبورد مدیریت | Muscle & Focus',
    notFound: 'صفحه یافت نشد | Muscle & Focus',
    paymentSuccess: 'پرداخت با موفقیت انجام شد | Muscle & Focus',
    paymentCancel: 'پرداخت لغو شد | Muscle & Focus',
  }
}

const ogDescriptions = {
  sv: 'Nå dina mål med Ali Wafa, din certifierade personliga tränare och online coach. Vi erbjuder skräddarsydda träningsprogram, kostscheman och coaching online eller på plats.',
  en: 'Reach your goals with Ali Wafa, your certified personal trainer and online coach. We offer tailored workout programs, diet plans, and coaching online or on-site.',
  fa: 'به اهداف خود برسید با علی وفا، مربی شخصی معتبر و مربی آنلاین شما. ما برنامه‌های تمرینی سفارشی، برنامه‌های غذایی و مربیگری آنلاین یا حضوری ارائه می‌دهیم.'
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
