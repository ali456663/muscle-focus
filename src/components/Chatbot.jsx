import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Sparkles, MessageCircle } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { useNavigate } from 'react-router-dom'
import './Chatbot.css'

function Chatbot() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // System translations for the Chatbot component
  const botTranslations = {
    sv: {
      botName: 'Muscle & Focus AI',
      botStatus: 'Online',
      welcome: 'Hej! Jag är Muscle & Focus AI-assistent. Jag kan berätta om våra träningspaket, priser, fördelar med styrketräning, BMI-hälsorisker eller hur du hittar en träningskompis. Vad vill du veta?',
      placeholder: 'Skriv ett meddelande...',
      chips: ['Träningspaket 🏋️', 'Boka Konsultation 📅', 'BMI-räknare 📊', 'Hitta Träningskompis 🤝'],
      chipReplies: {
        'Träningspaket 🏋️': 'Vi erbjuder skräddarsydda hybridpaket: allt från Livsstilsstarten (16 veckor), Glute & Leg Specialist (tjejpaket), till Komplett PT online (26 veckor) och teknikträning på plats. Klicka på "Träningspaket" i menyn för att läsa mer och ansöka!',
        'Boka Konsultation 📅': 'Du kan boka en helt kostnadsfri konsultation med Ali! Gå bara till sidan "Bli Klient" i menyn och fyll i formuläret, eller skicka ett e-postmeddelande till info.musclefocus@gmail.com.',
        'BMI-räknare 📊': 'Vi har en inbyggd kosmisk BMI-räknare på hemsidan! Klicka på "BMI-räknare" i navbaren för att testa, räkna ut ditt BMI, se din viktklass och läsa om hälsorisker kopplade till övervikt.',
        'Hitta Träningskompis 🤝': 'Vi har precis lagt till en ny funktion: "Hitta träningskompis"! Där kan du registrera ditt namn, ålder, stad, gym och t.ex. Snapchat för att komma i kontakt med andra träningspartners.'
      }
    },
    en: {
      botName: 'Muscle & Focus AI',
      botStatus: 'Online',
      welcome: 'Hi! I am the Muscle & Focus AI assistant. I can tell you about our training packages, pricing, benefits of strength training, BMI health risks, or how to find a training buddy. What would you like to know?',
      placeholder: 'Type a message...',
      chips: ['Training Packages 🏋️', 'Book Consultation 📅', 'BMI Calculator 📊', 'Find Training Buddy 🤝'],
      chipReplies: {
        'Training Packages 🏋️': 'We offer customized hybrid packages: Lifestyle Restart (16 weeks), Glute & Leg Specialist, Complete PT Online (26 weeks), and on-site Technique Training. Click "Training Packages" in the menu to read details!',
        'Book Consultation 📅': 'You can book a completely free consultation with Ali! Go to "Become Client" in the menu and fill in the form, or send an email to info.musclefocus@gmail.com.',
        'BMI Calculator 📊': 'We have a cosmic BMI Calculator on our website! Click "BMI Calculator" in the navbar to test it, calculate your BMI, and read about health risks associated with obesity.',
        'Find Training Buddy 🤝': 'We have a new feature: "Find Buddy"! Register your name, age, city, gym, and e.g., Snapchat/Instagram to connect with local training partners.'
      }
    },
    fa: {
      botName: 'دستیار هوشمند',
      botStatus: 'فعال',
      welcome: 'سلام! من دستیار هوشمند Muscle & Focus هستم. می‌توانم درباره پکیج‌های تمرینی، قیمت‌ها، فواید تمرینات قدرتی، خطرات سلامتی BMI یا نحوه یافتن هم‌تمرینی به شما توضیح دهم. چه سوالی دارید؟',
      placeholder: 'پیامی بنویسید...',
      chips: ['پکیج‌های تمرینی 🏋️', 'رزرو مشاوره 📅', 'محاسبه‌گر BMI 📊', 'یافتن هم‌تمرینی 🤝'],
      chipReplies: {
        'پکیج‌های تمرینی 🏋️': 'ما پکیج‌های هیبریدی متوعی ارائه می‌دهیم: شروع سبک زندگی جدید (۱۶ هفته)، متخصص باسن و پا (مخصوص بانوان)، مربیگری کامل آنلاین (۲۶ هفته) و آموزش تکنیک حضوری. برای اطلاعات بیشتر از منو روی "پکیج‌های تمرینی" کلیک کنید.',
        'رزرو مشاوره 📅': 'شما می‌توانید یک جلسه مشاوره کاملاً رایگان با علی رزرو کنید! کافیست به بخش "ثبت نام" در منو مراجعه کنید و فرم را پر کنید، یا به info.musclefocus@gmail.com ایمیل بزنید.',
        'محاسبه‌گر BMI 📊': 'ما یک محاسبه‌گر شاخص توده بدنی (BMI) کهکشانی در سایت داریم! برای اندازه گیری BMI، تعیین رده وزنی و مطالعه خطرات سلامتی، در بالای صفحه روی "شاخص BMI" کلیک کنید.',
        'یافتن هم‌تمرینی 🤝': 'ما قابلیت جدیدی به نام "یافتن هم‌تمرینی" اضافه کرده‌ایم! می‌توانید نام، سن، شهر، باشگاه و مثلاً آیدی اسنپ‌چت خود را ثبت کنید تا با دیگر هم‌تمرینی‌ها در شهر خود ارتباط بگیرید.'
      }
    }
  }

  const activeLang = botTranslations[language] || botTranslations.sv

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: activeLang.welcome,
        timestamp: new Date(),
        chips: activeLang.chips
      }
    ])
  }, [language])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = (textToSend) => {
    const text = textToSend || inputText
    if (!text.trim()) return

    // Add user message
    const newUserMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newUserMsg])
    if (!textToSend) setInputText('')

    // Simulate typing
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const botResponse = generateBotResponse(text)
      setMessages(prev => [...prev, botResponse])
    }, 800)
  }

  const handleChipClick = (chipText) => {
    // Add user message indicating selection
    const newUserMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: chipText,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newUserMsg])

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      // Look up pre-programmed reply for chip
      const reply = activeLang.chipReplies[chipText] || activeLang.welcome
      
      let redirectUrl = null
      if (chipText.includes('paket') || chipText.includes('Packages') || chipText.includes('پکیج')) redirectUrl = '/paket'
      if (chipText.includes('Boka') || chipText.includes('Consultation') || chipText.includes('مشاوره')) redirectUrl = '/ansok'
      if (chipText.includes('BMI') || chipText.includes('محاسبه')) redirectUrl = '/bmi'
      if (chipText.includes('kompis') || chipText.includes('Buddy') || chipText.includes('هم‌تمرینی')) redirectUrl = '/hitta-kompis'

      const newBotMsg = {
        id: Date.now().toString(),
        sender: 'bot',
        text: reply,
        timestamp: new Date(),
        // Add navigation button helper inside bot message if matched
        redirect: redirectUrl,
        chips: activeLang.chips.filter(c => c !== chipText)
      }
      setMessages(prev => [...prev, newBotMsg])
    }, 600)
  }

  const generateBotResponse = (query) => {
    const q = query.toLowerCase()
    const lang = language === 'fa' ? 'fa' : language === 'en' ? 'en' : 'sv'
    
    let reply = ''
    let redirect = null

    if (lang === 'sv') {
      if (q.includes('paket') || q.includes('pris') || q.includes('kostnad') || q.includes('erbjudande') || q.includes('kampanj')) {
        reply = 'Muscle & Focus erbjuder skräddarsydda hybridpaket för alla nivåer. Vi har allt från 16-veckors Lifestyle Restart och Glute Specialist till 26-veckors kompletta coachningsprogram samt enskild teknikträning i gymmet. Vill du se alla priser och detaljer? Klicka på länken nedan.'
        redirect = '/paket'
      } else if (q.includes('bmi') || q.includes('fetma') || q.includes('övervikt') || q.includes('obesitas') || q.includes('hälsa') || q.includes('risk')) {
        reply = 'BMI (Body Mass Index) jämför din vikt med din längd. Vår inbyggda räknare hjälper dig att tolka ditt värde och ger viktig information om risker som hjärt-kärlsjukdom, diabetes typ-2 och inflammation. Prova vår räknare här!'
        redirect = '/bmi'
      } else if (q.includes('kompis') || q.includes('buddy') || q.includes('hitta') || q.includes('gymkompis') || q.includes('snapchat')) {
        reply = 'Med vår nya funktion "Hitta träningskompis" kan du skriva upp dig med namn, ålder, stad, gym och Snapchat/Instagram för att hitta någon att svettas med. Du kan också filtrera efter stad eller gym. Kolla in sidan här!'
        redirect = '/hitta-kompis'
      } else if (q.includes('ali') || q.includes('coach') || q.includes('vem') || q.includes('ägare') || q.includes('wafa')) {
        reply = 'Ali Wafa är ägare av Muscle & Focus och är en licensierad personal trainer (IPT och IPT Advanced samt EREPS Level 4). Han brinner för att ge dig säkra och snabba resultat genom hybridcoaching, anpassad kost och träningstips!'
        redirect = '/licenser'
      } else if (q.includes('boka') || q.includes('ansök') || q.includes('konsultation') || q.includes('gratis') || q.includes('kontakt')) {
        reply = 'Vill du boka en gratis konsultation för att kickstarta din resa? Det tar bara 2 minuter att fylla i ansökningsformuläret. Klicka nedan för att gå till ansökningssidan!'
        redirect = '/ansok'
      } else if (q.includes('styrka') || q.includes('träna') || q.includes('varför') || q.includes('fördel')) {
        reply = 'Styrketräning ger fantastiska fysiska fördelar (starkare skelett, muskelmassa, ledstabilitet) samt mentala fördelar (bättre sömn, ökad fokus, minskad stress). Läs mer om varför du ska träna här!'
        redirect = '/varfor-styrketrana'
      } else if (q.includes('hej') || q.includes('tjena') || q.includes('hallå') || q.includes('läget')) {
        reply = 'Hej! Varmt välkommen. Jag är din AI-coach. Hur kan jag hjälpa dig idag? Fråga mig om våra paket, priser, BMI-beräkning eller hur du hittar en träningskompis!'
      } else {
        reply = 'Intressant fråga! Jag kan berätta mer om våra träningspaket, priser, BMI-räknaren eller hur du hittar en träningskompis. Du kan också använda snabbvalsknapparna nedan eller gå direkt till ansökan.'
      }
    } else if (lang === 'en') {
      if (q.includes('package') || q.includes('price') || q.includes('cost') || q.includes('offer') || q.includes('deal')) {
        reply = 'Muscle & Focus offers tailored hybrid packages for all fitness levels. We have Lifestyle Restart (16 weeks), Glute Specialist, 26-week coaching programs, and individual technique sessions. Click below to view all pricing and details!'
        redirect = '/paket'
      } else if (q.includes('bmi') || q.includes('obesity') || q.includes('overweight') || q.includes('health') || q.includes('risk')) {
        reply = 'BMI (Body Mass Index) compares your weight to your height. Our built-in calculator helps you calculate your value and read about associated health risks like cardiovascular disease or diabetes. Try it here!'
        redirect = '/bmi'
      } else if (q.includes('buddy') || q.includes('friend') || q.includes('find') || q.includes('gym') || q.includes('snapchat')) {
        reply = 'With our "Find Buddy" feature, you can register your name, age, city, gym, and Snapchat/Instagram to find local workout partners. You can search by city or gym too. Check it out!'
        redirect = '/hitta-kompis'
      } else if (q.includes('ali') || q.includes('coach') || q.includes('who') || q.includes('wafa')) {
        reply = 'Ali Wafa is the founder of Muscle & Focus. He is a certified Personal Trainer (IPT, IPT Advanced, and EREPS Level 4). He focuses on delivering fast, safe, and motivating results. Read more about him here!'
        redirect = '/licenser'
      } else if (q.includes('book') || q.includes('apply') || q.includes('consultation') || q.includes('free') || q.includes('contact')) {
        reply = 'Would you like to book a free consultation? Fill out the short form on our application page, or email info.musclefocus@gmail.com. Click below to apply!'
        redirect = '/ansok'
      } else if (q.includes('strength') || q.includes('train') || q.includes('why') || q.includes('benefit')) {
        reply = 'Strength training builds muscle mass, strengthens joints, improves sleep quality, boosts focus, and reduces stress. Click below to read all benefits!'
        redirect = '/varfor-styrketrana'
      } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        reply = 'Hello! Welcome to Muscle & Focus. I am your AI assistant. How can I help you today? Ask me about our programs, prices, BMI calculator, or training buddy finder!'
      } else {
        reply = 'Interesting question! I can tell you more about our training packages, pricing, the BMI calculator, or how to find a training buddy. You can also use the quick options below or book a free consultation.'
      }
    } else if (lang === 'fa') {
      if (q.includes('پکیج') || q.includes('قیمت') || q.includes('هزینه') || q.includes('تخفیف') || q.includes('خرید')) {
        reply = 'مجموعه Muscle & Focus پکیج‌های هیبریدی شخصی‌سازی شده‌ای برای تمامی سطوح ارائه می‌دهد (مانند شروع سبک زندگی، متخصص باسن و پا، مربیگری ۲۶ هفته‌ای و آموزش تکنیک حضوری). برای دیدن قیمت‌ها کلیک کنید.'
        redirect = '/paket'
      } else if (q.includes('bmi') || q.includes('چاقی') || q.includes('اضافه وزن') || q.includes('سلامت') || q.includes('خطرات')) {
        reply = 'شاخص توده بدنی (BMI) وزن شما را نسبت به قدتان می‌سنجد. محاسبه‌گر کهکشانی ما به شما کمک می‌کند رده وزنی و خطرات سلامتی مربوط به چاقی مانند کبد چرب و دیابت را بررسی کنید. امتحان کنید!'
        redirect = '/bmi'
      } else if (q.includes('هم‌تمرینی') || q.includes('دوست') || q.includes('یافتن') || q.includes('باشگاه') || q.includes('اسنپ')) {
        reply = 'با قابلیت جدید "یافتن هم‌تمرینی"، می‌توانید نام، سن، شهر، باشگاه و اسنپ‌چت خود را بنویسید تا دیگران با شما تماس بگیرند، یا در لیست شهر خود جستجو کنید. برای ورود کلیک کنید!'
        redirect = '/hitta-kompis'
      } else if (q.includes('علی') || q.includes('مربی') || q.includes('وفا') || q.includes('کیست')) {
        reply = 'علی وفا مربی مجاز و بین‌المللی بدنسازی (دارای مدارک معتبر IPT، IPT Advanced و ثبت شده در EREPS سطح ۴) و مؤسس Muscle & Focus است. او به شما کمک می‌کند به اندام دلخواهتان برسید.'
        redirect = '/licenser'
      } else if (q.includes('ثبت نام') || q.includes('رزرو') || q.includes('مشاوره') || q.includes('رایگان') || q.includes('تماس')) {
        reply = 'آیا مایلید یک جلسه مشاوره رایگان با علی داشته باشید؟ فرم کوتاه درخواست مربیگری را پر کنید یا به info.musclefocus@gmail.com ایمیل بزنید. برای ثبت نام کلیک کنید!'
        redirect = '/ansok'
      } else if (q.includes('قدرت') || q.includes('تمرین') || q.includes('چرا') || q.includes('فواید')) {
        reply = 'تمرینات قدرتی باعث افزایش توده عضلانی، بهبود سلامت استخوان‌ها و مفاصل، کاهش استرس، خواب بهتر و تمرکز بیشتر می‌شود. برای مطالعه فواید بیشتر کلیک کنید!'
        redirect = '/varfor-styrketrana'
      } else if (q.includes('سلام') || q.includes('درود') || q.includes('خوش')) {
        reply = 'سلام! به Muscle & Focus خوش آمدید. من دستیار هوشمند شما هستم. چطور می‌توانم کمکتان کنم؟ درباره پکیج‌ها، قیمت‌ها، محاسبه BMI یا یافتن هم‌تمرینی از من بپرسید!'
      } else {
        reply = 'سوال جالبی است! من می‌توانم اطلاعات بیشتری درباره پکیج‌های تمرینی، قیمت‌ها، محاسبه‌گر BMI یا نحوه یافتن هم‌تمرینی به شما بدهم. همچنین می‌توانید از گزینه‌های سریع زیر استفاده کنید.'
      }
    }

    return {
      id: Date.now().toString(),
      sender: 'bot',
      text: reply,
      timestamp: new Date(),
      redirect: redirect,
      chips: activeLang.chips
    }
  }

  const handleRedirect = (path) => {
    navigate(path)
    setIsOpen(false) // Close chatbot window after redirecting
  }

  return (
    <div className={`chatbot-wrapper ${language === 'fa' ? 'rtl-direction' : ''}`}>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="chatbot-float-btn"
          aria-label="Open Chatbot"
        >
          <MessageCircle size={28} />
          <div className="btn-pulse-glow"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window glass-panel fade-in">
          {/* Header */}
          <div className="chatbot-header">
            <div className="bot-profile-info">
              <div className="bot-avatar">
                <Sparkles size={16} />
              </div>
              <div className="bot-name-status">
                <h4>{activeLang.botName}</h4>
                <div className="status-indicator">
                  <span className="status-dot"></span>
                  <span className="status-text">{activeLang.botStatus}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="btn-close-chat" aria-label="Close Chat">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message-row ${msg.sender === 'user' ? 'user' : 'bot'}`}>
                {msg.sender === 'bot' && (
                  <div className="msg-avatar">
                    <Sparkles size={12} />
                  </div>
                )}
                <div className="msg-bubble">
                  <p>{msg.text}</p>
                  
                  {/* Redirect Button helper */}
                  {msg.redirect && (
                    <button 
                      onClick={() => handleRedirect(msg.redirect)} 
                      className="msg-redirect-btn"
                    >
                      {msg.redirect === '/paket' ? (language === 'fa' ? 'مشاهده پکیج‌ها 🏋️' : 'View Packages 🏋️') :
                       msg.redirect === '/ansok' ? (language === 'fa' ? 'رزرو رایگان 📅' : 'Book Free 📅') :
                       msg.redirect === '/bmi' ? (language === 'fa' ? 'محاسبه‌گر BMI 📊' : 'BMI Calculator 📊') :
                       msg.redirect === '/hitta-kompis' ? (language === 'fa' ? 'هم‌تمرینی 🤝' : 'Find Buddy 🤝') :
                       (language === 'fa' ? 'باز کردن صفحه 🔗' : 'Open Page 🔗')}
                    </button>
                  )}

                  <span className="msg-time">
                    {msg.timestamp.toLocaleTimeString(language === 'fa' ? 'fa-IR' : 'sv-SE', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Quick Action Chips inside the bot message */}
                {msg.sender === 'bot' && msg.chips && msg.chips.length > 0 && (
                  <div className="msg-chips-container">
                    {msg.chips.map((chip, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleChipClick(chip)}
                        className="msg-chip"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="chat-message-row bot typing">
                <div className="msg-avatar">
                  <Sparkles size={12} />
                </div>
                <div className="msg-bubble typing-bubble">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="chatbot-input-form"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={activeLang.placeholder}
              className="chat-input"
            />
            <button type="submit" className="btn-send-message">
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Chatbot
