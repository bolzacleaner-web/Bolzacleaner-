import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Phone, Mail, Clock, ChevronDown, LogOut, Eye, EyeOff, Download, Plus, Trash2, Edit2, Check } from 'lucide-react';

export default function BolzaCleaner() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedHours, setSelectedHours] = useState(2);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', address: '' });
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [payAfterWork, setPayAfterWork] = useState(false);
  const [customerSearchEmail, setCustomerSearchEmail] = useState('');
  const [customerBookings, setCustomerBookings] = useState([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);
  const [lastBooking, setLastBooking] = useState(null);

  const services = [
    { id: 1, name: 'Pulizie Civili', price: 15, pricePerM2: 1.5 },
    { id: 2, name: 'Pulizie Uffici Professionali', price: 18, pricePerM2: 2 },
    { id: 3, name: 'Pulizia Profonda Base', price: 20, pricePerM2: 2.5 },
    { id: 4, name: 'Pulizia Eccellente Premium', price: 28, pricePerM2: 3.5 },
    { id: 5, name: 'Pulizie per Aziende', price: 22, pricePerM2: 2.8 },
    { id: 6, name: 'Pulizie Post Ristrutturazione', price: 25, pricePerM2: 3 },
    { id: 7, name: 'Manutenzione Domestica', price: 16, pricePerM2: 2 },
    { id: 8, name: 'Giardinaggio', price: 12, pricePerM2: 1.2 },
    { id: 9, name: 'Assistenza Rapida', price: 20, pricePerM2: 2.5 },
  ];

  const frequencies = [
    { id: 1, name: 'Una tantum', discount: 0 },
    { id: 2, name: 'Settimanale', discount: 10 },
    { id: 3, name: 'Quindicinale', discount: 5 },
    { id: 4, name: 'Mensile', discount: 15 },
  ];

  const extras = [
    { id: 'ex1', name: 'Finestre', price: 10, category: 'ordinaire' },
    { id: 'ex2', name: 'Scaffali', price: 8, category: 'ordinaire' },
    { id: 'ex3', name: 'Mobili', price: 15, category: 'ordinaire' },
    { id: 'ex4', name: 'Tappeti', price: 20, category: 'ordinaire' },
    { id: 'ex5', name: 'Basamenti', price: 12, category: 'ordinaire' },
    { id: 'ex6', name: 'Porte/Pareti', price: 18, category: 'ordinaire' },
    { id: 'ex7', name: 'Disinfezione', price: 30, category: 'extraordinaire' },
    { id: 'ex8', name: 'Vapore', price: 35, category: 'extraordinaire' },
    { id: 'ex9', name: 'Antimuffa', price: 40, category: 'extraordinaire' },
    { id: 'ex10', name: 'Alta Pressione', price: 50, category: 'extraordinaire' },
    { id: 'ex11', name: 'Sanificazione Aria', price: 45, category: 'extraordinaire' },
    { id: 'ex12', name: 'Smacchiatura', price: 25, category: 'extraordinaire' },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('bolza_bookings');
    if (stored) setBookings(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('bolza_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const calculatePrice = () => {
    if (!selectedService || !selectedHours) return 0;
    const service = services.find(s => s.id === selectedService);
    const basePrice = service.price * selectedHours;
    const discount = frequencies.find(f => f.id === selectedFrequency)?.discount || 0;
    const discountedPrice = basePrice * (1 - discount / 100);
    const extrasPrice = selectedExtras.reduce((sum, id) => sum + (extras.find(e => e.id === id)?.price || 0), 0);
    return discountedPrice + extrasPrice;
  };

  const handleBooking = () => {
    if (!selectedService || !selectedFrequency || !selectedDate || !selectedTime || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !paymentMethod) {
      alert('Per favore, completa tutti i campi richiesti.');
      return;
    }

    const booking = {
      id: Date.now(),
      service: selectedService,
      frequency: selectedFrequency,
      hours: selectedHours,
      date: selectedDate,
      time: selectedTime,
      basePrice: services.find(s => s.id === selectedService).price * selectedHours,
      extras: selectedExtras.map(id => {
        const extra = extras.find(e => e.id === id);
        return { id, name: extra.name, price: extra.price };
      }),
      extrasPrice: selectedExtras.reduce((sum, id) => sum + (extras.find(e => e.id === id)?.price || 0), 0),
      totalPrice: calculatePrice(),
      customer: customerInfo,
      status: 'confermata',
      paymentMethod,
      paymentStatus: payAfterWork ? 'In sospeso' : 'completato',
      cancellationDate: null,
    };

    setBookings([...bookings, booking]);
    setLastBooking(booking);
    setCurrentPage('confirmation');
    resetBooking();
  };

  const resetBooking = () => {
    setBookingStep(1);
    setSelectedService(null);
    setSelectedFrequency(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedHours(2);
    setSelectedExtras([]);
    setCustomerInfo({ name: '', email: '', phone: '', address: '' });
    setPaymentMethod(null);
    setPayAfterWork(false);
  };

  const handleSearchCustomer = () => {
    const found = bookings.filter(b => b.customer.email === customerSearchEmail);
    setCustomerBookings(found);
  };

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancellata';
      booking.cancellationDate = new Date().toLocaleDateString('it-IT');
      setBookings([...bookings]);
      setShowCancelConfirm(null);
    }
  };

  const handleChatMessage = () => {
    if (!chatInput.trim()) return;
    const newMessages = [...messages, { type: 'user', text: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    setTimeout(() => {
      const responses = [
        'Grazie per la domanda! Come posso aiutarti?',
        'Siamo disponibili 24/7 per supporto.',
        'Per prenotazioni urgenti, chiama: +393204243674',
        'Visita il nostro sito: www.bolzacleaner.it',
      ];
      newMessages.push({ type: 'bot', text: responses[Math.floor(Math.random() * responses.length)] });
      setMessages([...newMessages]);
    }, 500);
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'BOLZA2024!') {
      setAdminLoggedIn(true);
      setAdminPassword('');
    } else {
      alert('Password non corretta!');
    }
  };

  const stats = {
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.status === 'confermata' ? b.totalPrice : 0), 0),
    paidCount: bookings.filter(b => b.paymentStatus === 'completato').length,
    extrasRevenue: bookings.reduce((sum, b) => sum + b.extrasPrice, 0),
  };

  // HOMEPAGE
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        {/* NAV */}
        <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg"></div>
                <span className="text-white font-bold">bolzacleaner</span>
              </div>
              <div className="hidden md:flex space-x-8">
                <button onClick={() => setCurrentPage('home')} className="text-white hover:text-teal-400">Inizio</button>
                <button onClick={() => setCurrentPage('booking')} className="text-white hover:text-teal-400">Prenota</button>
                <button onClick={() => setCurrentPage('mybookings')} className="text-white hover:text-teal-400">Mie Prenotazioni</button>
                <button onClick={() => setCurrentPage('admin')} className="text-white hover:text-teal-400">Admin</button>
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            {mobileMenuOpen && (
              <div className="md:hidden pb-4 space-y-2">
                <button onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block w-full text-left text-white hover:text-teal-400 py-2">Inizio</button>
                <button onClick={() => { setCurrentPage('booking'); setMobileMenuOpen(false); }} className="block w-full text-left text-white hover:text-teal-400 py-2">Prenota</button>
                <button onClick={() => { setCurrentPage('mybookings'); setMobileMenuOpen(false); }} className="block w-full text-left text-white hover:text-teal-400 py-2">Mie Prenotazioni</button>
                <button onClick={() => { setCurrentPage('admin'); setMobileMenuOpen(false); }} className="block w-full text-left text-white hover:text-teal-400 py-2">Admin</button>
              </div>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">Pulito che si vede, qualità che resta</h1>
          <p className="text-xl text-slate-300 mb-8">Pulizie professionali in Lombardia - Disponibili 24/7</p>
          <button onClick={() => setCurrentPage('booking')} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
            Prenota Ora
          </button>
        </section>

        {/* SERVICES */}
        <section className="bg-slate-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">I Nostri Servizi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map(service => (
                <div key={service.id} className="bg-slate-700 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-teal-400 mb-2">{service.name}</h3>
                  <p className="text-slate-300">€{service.price}/h</p>
                  <button onClick={() => { setCurrentPage('booking'); setSelectedService(service.id); setBookingStep(2); }} className="mt-4 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded w-full">
                    Seleziona
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PERCHE SCEGLIERE */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Perché Scegliere bolzacleaner</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-teal-400 mb-2">✓ Professionali Certificati</h3>
                <p className="text-slate-300">Team esperti con anni di esperienza nel settore delle pulizie professionali.</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-teal-400 mb-2">✓ Prodotti Eco-Friendly</h3>
                <p className="text-slate-300">Utilizziamo solo prodotti naturali e sostenibili per l'ambiente.</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-teal-400 mb-2">✓ Disponibilità 24/7</h3>
                <p className="text-slate-300">Contattaci in qualsiasi momento per le tue esigenze di pulizia.</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-teal-400 mb-2">✓ Prezzi Competitivi</h3>
                <p className="text-slate-300">Offriamo i migliori prezzi sul mercato con sconti per clienti fedeli.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-slate-800 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Domande Frequenti</h2>
            <div className="space-y-4">
              {[
                { q: 'Quali sono gli orari di servizio?', a: 'Siamo disponibili 24/7 per le tue esigenze.' },
                { q: 'Come posso prenotare?', a: 'Usa la nostra piattaforma online per prenotazioni istantanee.' },
                { q: 'Che metodi di pagamento accettate?', a: 'Accettiamo carta di credito, PayPal, bonifico bancario e Apple/Google Pay.' },
                { q: 'Posso cancellare una prenotazione?', a: 'Sì, puoi cancellarla fino a 24h prima del servizio.' },
              ].map((faq, idx) => (
                <div key={idx} className="bg-slate-700 p-4 rounded-lg">
                  <h4 className="font-bold text-teal-400 mb-2">{faq.q}</h4>
                  <p className="text-slate-300">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACTS */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Contatti</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Phone className="mx-auto mb-4 text-teal-400" size={32} />
                <p className="text-white font-bold">+393204243674</p>
              </div>
              <div>
                <Mail className="mx-auto mb-4 text-teal-400" size={32} />
                <p className="text-white font-bold">bolzacleaner@gmail.com</p>
              </div>
              <div>
                <MapPin className="mx-auto mb-4 text-teal-400" size={32} />
                <p className="text-white font-bold">Lombardia, Italia</p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-slate-400">www.bolzacleaner.it</p>
            </div>
          </div>
        </section>

        {/* CHAT BOT */}
        <div className="fixed bottom-6 right-6 z-40">
          {!chatOpen ? (
            <button onClick={() => setChatOpen(true)} className="bg-teal-500 hover:bg-teal-600 text-white rounded-full p-4 shadow-lg">
              💬
            </button>
          ) : (
            <div className="bg-slate-800 border border-teal-500 rounded-lg shadow-lg w-80">
              <div className="bg-teal-500 text-white p-4 rounded-t-lg flex justify-between items-center">
                <span className="font-bold">bolzacleaner Chat</span>
                <button onClick={() => setChatOpen(false)} className="text-white">✕</button>
              </div>
              <div className="h-64 overflow-y-auto p-4 bg-slate-900">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`mb-2 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block px-3 py-2 rounded-lg ${msg.type === 'user' ? 'bg-teal-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-700 flex gap-2">
                <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleChatMessage()} placeholder="Scrivi..." className="flex-1 bg-slate-700 text-white px-3 py-2 rounded" />
                <button onClick={handleChatMessage} className="bg-teal-500 text-white px-4 py-2 rounded">📤</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }// BOOKING PAGE
  if (currentPage === 'booking') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        {/* NAV */}
        <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button onClick={() => setCurrentPage('home')} className="text-white font-bold">← Indietro</button>
              <span className="text-white">Prenotazione</span>
              <div></div>
            </div>
          </div>
        </nav>

        {/* BOOKING STEPS */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className={`flex-1 h-2 mx-1 rounded ${step <= bookingStep ? 'bg-teal-500' : 'bg-slate-700'}`}></div>
            ))}
          </div>

          {/* STEP 1: SERVICE */}
          {bookingStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Seleziona il Servizio</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(service => (
                  <button key={service.id} onClick={() => { setSelectedService(service.id); setBookingStep(2); }} className={`p-4 rounded-lg text-left border-2 transition ${selectedService === service.id ? 'border-teal-500 bg-teal-500 bg-opacity-20' : 'border-slate-700 hover:border-teal-500'}`}>
                    <h3 className="font-bold text-white">{service.name}</h3>
                    <p className="text-slate-300">€{service.price}/h</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: FREQUENCY & HOURS */}
          {bookingStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Frequenza e Durata</h2>
              <div className="mb-6">
                <label className="text-white font-bold block mb-2">Frequenza:</label>
                <select value={selectedFrequency || ''} onChange={e => setSelectedFrequency(Number(e.target.value))} className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600">
                  <option value="">Seleziona frequenza...</option>
                  {frequencies.map(freq => (
                    <option key={freq.id} value={freq.id}>{freq.name} {freq.discount > 0 ? `(-${freq.discount}%)` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="text-white font-bold block mb-2">Ore: {selectedHours}</label>
                <input type="range" min="1" max="8" value={selectedHours} onChange={e => setSelectedHours(Number(e.target.value))} className="w-full" />
              </div>
              <div className="flex gap-4">
                <button onClick={() => setBookingStep(1)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded">Indietro</button>
                <button onClick={() => setBookingStep(3)} disabled={!selectedFrequency} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded disabled:opacity-50">Avanti</button>
              </div>
            </div>
          )}

          {/* STEP 3: DATE, TIME, EXTRAS */}
          {bookingStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Data, Ora e Servizi Extra</h2>
              <div className="mb-4">
                <label className="text-white font-bold block mb-2">Data:</label>
                <input type="date" value={selectedDate || ''} onChange={e => setSelectedDate(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600" />
              </div>
              <div className="mb-4">
                <label className="text-white font-bold block mb-2">Ora:</label>
                <input type="time" value={selectedTime || ''} onChange={e => setSelectedTime(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600" />
              </div>
              <div className="mb-4">
                <label className="text-white font-bold block mb-2">Servizi Extra:</label>
                <div className="grid grid-cols-2 gap-2">
                  {extras.map(extra => (
                    <button key={extra.id} onClick={() => setSelectedExtras(selectedExtras.includes(extra.id) ? selectedExtras.filter(id => id !== extra.id) : [...selectedExtras, extra.id])} className={`p-2 rounded text-sm border transition ${selectedExtras.includes(extra.id) ? 'border-teal-500 bg-teal-500 bg-opacity-20' : 'border-slate-600 hover:border-teal-500'}`}>
                      <span className="text-white">{extra.name}</span>
                      <span className="text-slate-300 text-xs">+€{extra.price}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-slate-700 p-4 rounded mb-4">
                <p className="text-slate-300">Prezzo Totale: <span className="text-teal-400 font-bold text-2xl">€{calculatePrice().toFixed(2)}</span></p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setBookingStep(2)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded">Indietro</button>
                <button onClick={() => setBookingStep(4)} disabled={!selectedDate || !selectedTime} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded disabled:opacity-50">Avanti</button>
              </div>
            </div>
          )}

          {/* STEP 4: CUSTOMER INFO & PAYMENT */}
          {bookingStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Informazioni Personali e Pagamento</h2>
              <div className="mb-4">
                <input type="text" placeholder="Nome" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 mb-3" />
                <input type="email" placeholder="Email" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})} className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 mb-3" />
                <input type="tel" placeholder="Telefono" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 mb-3" />
                <input type="text" placeholder="Indirizzo" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600" />
              </div>
              <div className="mb-4">
                <label className="text-white font-bold block mb-2">Metodo di Pagamento:</label>
                <select value={paymentMethod || ''} onChange={e => setPaymentMethod(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600">
                  <option value="">Seleziona metodo...</option>
                  <option value="carta">Carta di Credito (Stripe)</option>
                  <option value="paypal">PayPal</option>
                  <option value="bonifico">Bonifico Bancario - IT60X0542811101000000123456</option>
                  <option value="applepay">Apple Pay / Google Pay</option>
                </select>
              </div>
              <label className="text-white flex items-center mb-4">
                <input type="checkbox" checked={payAfterWork} onChange={e => setPayAfterWork(e.target.checked)} className="mr-2" />
                <span>Paga dopo il lavoro</span>
              </label>
              <div className="flex gap-4">
                <button onClick={() => setBookingStep(3)} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 px-4 rounded">Indietro</button>
                <button onClick={handleBooking} disabled={!paymentMethod} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded disabled:opacity-50 font-bold">Conferma Prenotazione</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // CONFIRMATION PAGE
  if (currentPage === 'confirmation' && lastBooking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        {/* NAV */}
        <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div></div>
              <span className="text-white font-bold">Conferma Prenotazione</span>
              <div></div>
            </div>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-8 rounded-lg text-white text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">✓ Prenotazione Confermata!</h1>
            <p className="text-teal-100">Numero Prenotazione: <span className="font-bold text-xl">#{lastBooking.id}</span></p>
          </div>

          <div className="bg-slate-700 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold text-teal-400 mb-4">Dettagli Prenotazione</h2>
            <div className="space-y-2 text-slate-300">
              <p><strong>Servizio:</strong> {services.find(s => s.id === lastBooking.service)?.name}</p>
              <p><strong>Data:</strong> {lastBooking.date}</p>
              <p><strong>Ora:</strong> {lastBooking.time}</p>
              <p><strong>Durata:</strong> {lastBooking.hours} ore</p>
              {lastBooking.extras.length > 0 && (
                <div>
                  <strong>Servizi Extra:</strong>
                  <ul className="ml-4">
                    {lastBooking.extras.map(extra => (
                      <li key={extra.id}>- {extra.name} (€{extra.price})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-700 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold text-teal-400 mb-4">Riepilogo Costi</h2>
            <div className="space-y-2 text-slate-300 mb-4">
              <p className="flex justify-between"><span>Prezzo Base:</span> <span>€{lastBooking.basePrice.toFixed(2)}</span></p>
              {lastBooking.extrasPrice > 0 && <p className="flex justify-between"><span>Servizi Extra:</span> <span>€{lastBooking.extrasPrice.toFixed(2)}</span></p>}
              <div className="border-t border-slate-600 pt-2 flex justify-between font-bold text-teal-400">
                <span>Totale:</span>
                <span>€{lastBooking.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-sm"><strong>Pagamento:</strong> {lastBooking.paymentStatus}</p>
          </div>

          <div className="bg-slate-700 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-bold text-teal-400 mb-4">Informazioni Cliente</h2>
            <div className="space-y-2 text-slate-300">
              <p><strong>Nome:</strong> {lastBooking.customer.name}</p>
              <p><strong>Email:</strong> {lastBooking.customer.email}</p>
              <p><strong>Telefono:</strong> {lastBooking.customer.phone}</p>
              <p><strong>Indirizzo:</strong> {lastBooking.customer.address}</p>
            </div>
          </div>

          <div className="bg-blue-900 bg-opacity-50 border border-blue-500 p-4 rounded-lg mb-6">
            <p className="text-blue-200 text-sm">📧 Una conferma è stata inviata al tuo indirizzo email e tramite SMS</p>
          </div>

          <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 p-4 rounded-lg mb-6">
            <p className="text-yellow-200 text-sm"><strong>Politica di Cancellazione:</strong> È possibile cancellare fino a 24 ore prima del servizio per un rimborso completo.</p>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setCurrentPage('mybookings')} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded font-bold">📋 Vedi Mie Prenotazioni</button>
            <button onClick={() => setCurrentPage('home')} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded font-bold">🏠 Torna alla Home</button>
          </div>
        </div>
      </div>
    );
  }// MY BOOKINGS PAGE
  if (currentPage === 'mybookings') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        {/* NAV */}
        <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button onClick={() => setCurrentPage('home')} className="text-white font-bold">← Indietro</button>
              <span className="text-white">Mie Prenotazioni</span>
              <div></div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <input type="email" placeholder="Inserisci la tua email" value={customerSearchEmail} onChange={e => setCustomerSearchEmail(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded border border-slate-600 mb-3" />
            <button onClick={handleSearchCustomer} className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded font-bold">Cerca Prenotazioni</button>
          </div>

          {customerBookings.length === 0 ? (
            <div className="bg-slate-700 p-8 rounded-lg text-center">
              <p className="text-slate-300 text-lg">Nessuna prenotazione trovata. Fai una ricerca con la tua email!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customerBookings.map(booking => (
                <div key={booking.id} className="bg-slate-700 p-6 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-teal-400">{services.find(s => s.id === booking.service)?.name}</h3>
                      <p className="text-slate-300">Prenotazione #{booking.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-bold ${booking.status === 'confermata' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 text-slate-300 text-sm">
                    <p><strong>Data:</strong> {booking.date}</p>
                    <p><strong>Ora:</strong> {booking.time}</p>
                    <p><strong>Durata:</strong> {booking.hours} ore</p>
                    <p><strong>Totale:</strong> €{booking.totalPrice.toFixed(2)}</p>
                  </div>
                  {booking.status === 'confermata' && (
                    <button onClick={() => setShowCancelConfirm(booking.id)} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">
                      Cancella Prenotazione
                    </button>
                  )}
                  {showCancelConfirm === booking.id && (
                    <div className="mt-4 bg-red-900 bg-opacity-50 p-4 rounded">
                      <p className="text-white mb-4">Sei sicuro di voler cancellare questa prenotazione?</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleCancelBooking(booking.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded">Conferma</button>
                        <button onClick={() => setShowCancelConfirm(null)} className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded">Annulla</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ADMIN PAGE
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        {/* NAV */}
        <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button onClick={() => setCurrentPage('home')} className="text-white font-bold">← Home</button>
              <span className="text-white font-bold">Admin Panel</span>
              {adminLoggedIn && <button onClick={() => { setAdminLoggedIn(false); setCurrentPage('home'); }} className="text-white"><LogOut size={20} /></button>}
            </div>
          </div>
        </nav>

        {!adminLoggedIn ? (
          <div className="max-w-md mx-auto px-4 py-20">
            <div className="bg-slate-700 p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
              <input type="password" placeholder="Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAdminLogin()} className="w-full bg-slate-600 text-white p-3 rounded border border-slate-500 mb-4" />
              <label className="text-slate-300 flex items-center mb-4">
                <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} className="mr-2" />
                <span>Mostra password</span>
              </label>
              <button onClick={handleAdminLogin} className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 px-4 rounded font-bold">Accedi</button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-700 p-6 rounded-lg">
                <p className="text-slate-400 text-sm">Prenotazioni Totali</p>
                <p className="text-3xl font-bold text-teal-400">{stats.totalBookings}</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <p className="text-slate-400 text-sm">Ricavi Totali</p>
                <p className="text-3xl font-bold text-teal-400">€{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <p className="text-slate-400 text-sm">Pagamenti Completati</p>
                <p className="text-3xl font-bold text-teal-400">{stats.paidCount}</p>
              </div>
              <div className="bg-slate-700 p-6 rounded-lg">
                <p className="text-slate-400 text-sm">Ricavi da Extra</p>
                <p className="text-3xl font-bold text-teal-400">€{stats.extrasRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="bg-slate-700 p-6 rounded-lg overflow-x-auto">
              <h2 className="text-2xl font-bold text-white mb-4">Tutte le Prenotazioni</h2>
              <table className="w-full text-sm text-slate-300">
                <thead className="border-b border-slate-600">
                  <tr>
                    <th className="text-left py-2">Data</th>
                    <th className="text-left py-2">Cliente</th>
                    <th className="text-left py-2">Servizio</th>
                    <th className="text-left py-2">Ore</th>
                    <th className="text-left py-2">Extra</th>
                    <th className="text-left py-2">Prezzo</th>
                    <th className="text-left py-2">Pagamento</th>
                    <th className="text-left py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking.id} className="border-b border-slate-600">
                      <td className="py-3">{booking.date}</td>
                      <td className="py-3">{booking.customer.name}<br/><span className="text-xs text-slate-400">{booking.customer.phone}</span></td>
                      <td className="py-3">{services.find(s => s.id === booking.service)?.name}</td>
                      <td className="py-3">{booking.hours}h</td>
                      <td className="py-3">{booking.extras.length}</td>
                      <td className="py-3 font-bold text-teal-400">€{booking.totalPrice.toFixed(2)}</td>
                      <td className="py-3">{booking.paymentStatus}</td>
                      <td className="py-3"><span className={`px-2 py-1 rounded text-xs ${booking.status === 'confermata' ? 'bg-green-600' : 'bg-red-600'}`}>{booking.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Pagina non trovata</div>;
}
