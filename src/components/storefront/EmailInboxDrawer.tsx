import React, { useState } from 'react';
import { Mail, X, CheckCircle, ExternalLink, Calendar } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { EmailNotification } from '../../types';

export const EmailInboxDrawer: React.FC = () => {
  const { emails, isEmailInboxOpen, setIsEmailInboxOpen } = useStore();
  const [selectedEmail, setSelectedEmail] = useState<EmailNotification | null>(null);

  if (!isEmailInboxOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => { setIsEmailInboxOpen(false); setSelectedEmail(null); }}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-3xl bg-[#FAF9F6] shadow-2xl flex flex-col border-l border-neutral-200">
          
          {/* Header */}
          <div className="p-6 bg-white border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-neutral-900">Transactional Email Engine Log</h2>
                <p className="text-xs text-neutral-500">Simulating live Resend / SMTP email delivery across EVOQUE events (Section 9)</p>
              </div>
            </div>
            <button
              onClick={() => { setIsEmailInboxOpen(false); setSelectedEmail(null); }}
              className="p-2 text-neutral-500 hover:text-black rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-200 bg-white">
            
            {/* Left Column: Email List */}
            <div className="md:col-span-5 overflow-y-auto p-4 space-y-3 bg-[#FAF9F6]">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2">
                Sent Notifications ({emails.length})
              </p>
              {emails.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400">
                  No transactional emails sent yet. Try creating an account or placing a COD order!
                </div>
              ) : (
                emails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  const badgeColor = email.eventType === 'SIGN_UP_WELCOME' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                    : email.eventType === 'ORDER_PLACED' 
                    ? 'bg-sky-100 text-sky-800 border-sky-300' 
                    : 'bg-amber-100 text-amber-800 border-amber-300';

                  return (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmail(email)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-white border-neutral-900 shadow-md scale-101' 
                          : 'bg-white/80 border-neutral-200 hover:bg-white hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                          {email.eventType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {new Date(email.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="font-semibold text-xs text-neutral-900 line-clamp-1">
                        {email.subject}
                      </h4>
                      <p className="text-[11px] text-neutral-500 mt-1 line-clamp-1">
                        To: {email.recipientName} ({email.recipientEmail})
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right Column: HTML Render Preview */}
            <div className="md:col-span-7 overflow-y-auto p-6 bg-white flex flex-col">
              {selectedEmail ? (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-medium">To:</span>
                      <span className="font-semibold text-neutral-900">{selectedEmail.recipientName} &lt;{selectedEmail.recipientEmail}&gt;</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-medium">Subject:</span>
                      <span className="font-bold text-neutral-900">{selectedEmail.subject}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-neutral-400">
                      <span>Event Trigger: <code className="bg-neutral-200 px-1 rounded text-neutral-700">{selectedEmail.eventType}</code></span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(selectedEmail.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Rendered HTML Box */}
                  <div className="flex-1 border border-neutral-200 rounded-2xl overflow-hidden bg-[#FAF9F6] p-4">
                    <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest pb-2 mb-2 border-b border-neutral-200 flex items-center justify-between">
                      <span>HTML Email Template Preview</span>
                      <span className="text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Mobile Responsive</span>
                    </div>
                    <div 
                      className="bg-white rounded-xl shadow-xs p-2 overflow-y-auto max-h-[500px]"
                      dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent }}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400 space-y-3">
                  <Mail className="w-12 h-12 stroke-1" />
                  <p className="font-serif font-medium text-sm text-neutral-700">Select an email from the left column to view</p>
                  <p className="text-xs max-w-xs">You can inspect the exact HTML content generated for sign-up confirmations, COD orders, and Steadfast courier shipping updates.</p>
                </div>
              )}
            </div>

          </div>

          {/* Footer Note */}
          <div className="p-4 bg-neutral-900 text-neutral-300 text-xs flex items-center justify-between">
            <span>Simulated SMTP engine ready for Resend / SendGrid API token injection.</span>
            <button 
              onClick={() => setIsEmailInboxOpen(false)}
              className="text-white font-semibold underline underline-offset-4"
            >
              Close Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
