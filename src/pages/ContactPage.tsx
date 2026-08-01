import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageCircle, Instagram, Facebook, Youtube } from 'lucide-react';
import { SEO } from '../components/common/SEO';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out your name, email, and message.');
      return;
    }
    setSent(true);
    setName('');
    setEmail('');
    setOrderId('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-12">
      <SEO 
        title="Contact Us | EVOQUE Support"
        description="Get in touch with the EVOQUE client care team in Dhaka, Bangladesh for order inquiries, sizing guidance, and atelier support."
        ogType="article"
      />

      <div className="text-center space-y-4 pb-6 border-b border-neutral-200">
        <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">Client Care & Studio</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-neutral-900 tracking-tight">
          Contact EVOQUE
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
          We are dedicated to providing exceptional support. Whether you have questions about sizing, fabric care, or your Cash on Delivery parcel, our team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-xs space-y-6">
          <h3 className="font-serif font-bold text-xl text-neutral-900">Send an Inquiry</h3>
          
          {sent && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Thank you for your message. A dedicated client advisor will reply to your email within 12 hours.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tanvir Ahmed"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tanvir@example.com"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Order Number / ID (Optional)
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. EVQ-ORD-8921"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono uppercase focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                Your Message *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can our atelier assist you today?"
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3.5 bg-neutral-900 hover:bg-black text-white font-semibold text-xs tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Transmit Message</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Right Column: Contact Channels & Location */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-lg text-neutral-900">Direct Channels</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 uppercase tracking-wider">Email Inquiry</p>
                  <p className="text-neutral-600 font-mono mt-0.5">evoque.hq@gmail.com</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Average response time: 2-4 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 uppercase tracking-wider">Client Care Phone</p>
                  <p className="text-neutral-600 font-mono mt-0.5">+880 1603642630</p>
                  <p className="text-neutral-400 text-[11px] mt-0.5">Available Saturday — Thursday (10:00 AM – 7:00 PM)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-neutral-900 uppercase tracking-wider">Atelier Studio</p>
                  <p className="text-neutral-600 mt-0.5">Rangpur, Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Official Social Channels</p>
              <div className="flex flex-wrap gap-2.5">
                <a 
                  href="https://wa.me/8801995111632" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-semibold transition-colors border border-emerald-200/60"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Chat</span>
                </a>
                <a 
                  href="https://instagram.com/evoque_bd?igsh=MTluaWJwZXp4eWFrdQ==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 bg-pink-50 text-pink-900 hover:bg-pink-100 rounded-xl text-xs font-semibold transition-colors border border-pink-200/60"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </a>
                <a 
                  href="https://facebook.com/share/1BScnoENGa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors border border-blue-200/60"
                >
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span>Facebook</span>
                </a>
                <a 
                  href="https://www.youtube.com/channel/UCoLywaa4fLidv-AZEN4GJiQ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-2 bg-red-50 text-red-900 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors border border-red-200/60"
                >
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-neutral-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <Clock className="w-4 h-4" />
              <span>Dispatch Hours</span>
            </div>
            <h4 className="font-serif font-bold text-base">Rapid Dispatch Window</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our studio operates 6 days a week. Orders finalized by 4:00 PM are processed and handed over to Steadfast Courier on the same evening.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
