import { useEffect } from 'react'

const schemaTemplates = {
  // LocalBusiness: Huvudschema för Muscle & Focus
  localBusiness: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Muscle & Focus',
    description: 'Premium personlig träning, kostrådgivning och coaching online eller på plats med Lic. PT Ali Wafa.',
    url: 'https://www.musclefocusfitness.com',
    logo: 'https://www.musclefocusfitness.com/logo.png',
    image: 'https://www.musclefocusfitness.com/hero_fitness.png',
    telephone: '+46700361289',
    email: 'info.musclefocus@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'SE',
      addressLocality: 'Stockholm',
      addressRegion: 'Stockholms län'
    },
    priceRange: '$$',
    currenciesAccepted: 'SEK',
    paymentAccepted: 'Kort, Swish, Faktura, Delbetalning',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      description: 'Online-coachning tillgänglig 7 dagar i veckan. Fysiska pass efter bokning.'
    },
    sameAs: [
      'https://instagram.com/musclefocus1',
      'https://www.musclefocusfitness.com'
    ],
    serviceType: 'Personlig träning, kostrådgivning, online coaching'
  },

  // Person: Ali Wafa som Person (huvudperson bakom företaget)
  person: {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ali Wafa',
    jobTitle: 'Licensed Personal Trainer',
    description: 'Certifierad personlig tränare med över 8 års erfarenhet inom styrketräning, viktminskning och konditionsträning. Flerspråkig coaching på svenska, engelska, persiska, arabiska, turkiska, tyska, spanska, franska och ryska.',
    url: 'https://www.musclefocusfitness.com',
    image: 'https://www.musclefocusfitness.com/ali_profile.png',
    telephone: '+46700361289',
    email: 'info.musclefocus@gmail.com',
    sameAs: [
      'https://instagram.com/musclefocus1'
    ],
    worksFor: {
      '@type': 'Organization',
      name: 'Muscle & Focus'
    },
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'License',
        name: 'Licensed Personal Trainer – IntensivePT',
        recognizedBy: {
          '@type': 'Organization',
          name: 'IntensivePT'
        }
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Certificate',
        name: 'IPT Advanced – Avancerad träningslära',
        recognizedBy: {
          '@type': 'Organization',
          name: 'IntensivePT'
        }
      },
      {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'Certificate',
        name: 'EREPS Level 4 – EQF Level 4 Personal Trainer',
        recognizedBy: {
          '@type': 'Organization',
          name: 'European Register of Exercise Professionals (EREPS)'
        }
      }
    ]
  },

  // Service: Träningspaketen
  service: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Personlig träning och kostrådgivning',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Muscle & Focus'
    },
    description: 'Skräddarsydda tränings- och kostupplägg med personlig coachning online och på plats.',
    areaServed: {
      '@type': 'Country',
      name: 'Sverige'
    },
    serviceType: 'Personlig träning, kostrådgivning, online coaching',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'SEK',
      availability: 'https://schema.org/InStock',
      url: 'https://www.musclefocusfitness.com/paket'
    }
  },

  // WebPage: Generisk WebPage schema
  webPage: (title, description) => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: 'https://www.musclefocusfitness.com',
    publisher: {
      '@type': 'LocalBusiness',
      name: 'Muscle & Focus'
    }
  }),

  // FAQPage: För BMI-sidan (har FAQ-sektion)
  faqPage: (faqItems) => ({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  }),

  // Review: För kundomdömen
  review: (reviewData) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: reviewData.name
    },
    reviewBody: reviewData.text,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5'
    },
    publisher: {
      '@type': 'LocalBusiness',
      name: 'Muscle & Focus'
    }
  })
}

/**
 * Injects a JSON-LD schema script tag into the document head.
 * Removes any existing script with the same id before adding.
 */
function injectSchema(id, schemaObject) {
  // Remove existing script if present
  const existing = document.getElementById(id)
  if (existing) {
    existing.remove()
  }

  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = id
  script.textContent = JSON.stringify(schemaObject)
  document.head.appendChild(script)
}

/**
 * Hook to inject schema.org structured data.
 * 
 * Usage:
 *   useSchemaOrg(['localBusiness', 'person'])  // inject static schemas
 *   useSchemaOrg('faqPage', faqItems)          // inject dynamic FAQ
 */
export function useSchemaOrg(schemas, dynamicData = null) {
  useEffect(() => {
    const ids = []

    const schemaArray = Array.isArray(schemas) ? schemas : [schemas]

    schemaArray.forEach(schemaName => {
      const template = schemaTemplates[schemaName]
      if (!template) return

      const id = `schema-${schemaName}`
      ids.push(id)

      let schemaObject
      if (typeof template === 'function') {
        schemaObject = template(dynamicData)
      } else {
        schemaObject = template
      }

      injectSchema(id, schemaObject)
    })

    // Cleanup: remove injected scripts on unmount
    return () => {
      ids.forEach(id => {
        const el = document.getElementById(id)
        if (el) el.remove()
      })
    }
  }, [schemas, dynamicData])
}

export { schemaTemplates }
