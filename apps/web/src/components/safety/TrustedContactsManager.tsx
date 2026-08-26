'use client';

import React, { useState } from 'react';
import { Users, Plus, Trash2, Phone, Star, X } from 'lucide-react';
import { useTrustedContacts } from '../../hooks/useSafety';

export default function TrustedContactsManager() {
  const { contacts, isLoaded, addContact, deleteContact, setPrimaryContact } = useTrustedContacts();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notifyViaSms, setNotifyViaSms] = useState(true);
  const [notifyViaWhatsapp, setNotifyViaWhatsapp] = useState(true);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addContact({
      name: name.trim(),
      relationship,
      phone: phone.trim(),
      email: email.trim() || undefined,
      isPrimary: contacts.length === 0,
      notifyViaSms,
      notifyViaWhatsapp,
    });

    setName('');
    setPhone('');
    setEmail('');
    setIsAdding(false);
  };

  if (!isLoaded) {
    return (
      <div className="h-40 animate-pulse rounded-3xl border border-emerald-500/20 bg-slate-900/40 p-6" />
    );
  }

  return (
    <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-emerald-900/40 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-400" />
            <span>Trusted Emergency Contacts</span>
          </h3>
          <p className="text-xs text-emerald-300/70">
            Automatically notified with your live GPS location during an SOS trigger
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Trusted Contact</span>
          </button>
        )}
      </div>

      {/* Add New Contact Form */}
      {isAdding && (
        <form
          onSubmit={handleSaveContact}
          className="mt-4 rounded-2xl border border-emerald-500/40 bg-slate-950/80 p-4 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2">
            <span className="text-xs font-bold text-white">Add New Trusted Contact</span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] font-semibold text-emerald-300/80 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Karma Dorjee"
                className="w-full rounded-xl border border-emerald-500/30 bg-slate-900 p-2 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-emerald-300/80 block mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={e => setRelationship(e.target.value)}
                className="w-full rounded-xl border border-emerald-500/30 bg-slate-900 p-2 text-xs text-white outline-none"
              >
                <option value="Family">Family / Spouse / Parent</option>
                <option value="Sikkim Tour Guide">Sikkim Tour Guide</option>
                <option value="Local Driver / Cab">Local Driver / Cab</option>
                <option value="Friend">Friend / Fellow Traveler</option>
                <option value="Hotel Host">Hotel / Homestay Host</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-emerald-300/80 block mb-1">
                Phone Number (with Country Code) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98320 XXXXX"
                className="w-full rounded-xl border border-emerald-500/30 bg-slate-900 p-2 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-emerald-300/80 block mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contact@example.com"
                className="w-full rounded-xl border border-emerald-500/30 bg-slate-900 p-2 text-xs text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/80 pt-2">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyViaWhatsapp}
                onChange={e => setNotifyViaWhatsapp(e.target.checked)}
                className="rounded border-emerald-500 text-emerald-500"
              />
              <span>Notify via WhatsApp</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyViaSms}
                onChange={e => setNotifyViaSms(e.target.checked)}
                className="rounded border-emerald-500 text-emerald-500"
              />
              <span>Notify via SMS</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="mt-4 space-y-3">
        {contacts.length === 0 ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/40 p-6 text-center text-xs text-emerald-300/70">
            No personal trusted contacts added yet. Add at least one family member or local guide.
          </div>
        ) : (
          contacts.map(contact => (
            <div
              key={contact.id}
              className={`rounded-2xl border p-4 transition-all flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${
                contact.isPrimary
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : 'border-slate-800 bg-slate-950/40 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 font-bold">
                  {contact.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{contact.name}</h4>
                    <span className="rounded-full bg-emerald-950 px-2 py-0.2 text-[10px] font-semibold text-emerald-300 border border-emerald-500/30">
                      {contact.relationship}
                    </span>
                    {contact.isPrimary && (
                      <span className="flex items-center gap-0.5 rounded-full bg-amber-500/20 px-2 py-0.2 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                        <Star className="h-2.5 w-2.5 fill-amber-400" />
                        <span>Primary</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-emerald-200/70">
                    <span className="font-mono">{contact.phone}</span>
                    {contact.email && <span>{contact.email}</span>}
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <a
                  href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`}
                  className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2 text-emerald-300 hover:bg-emerald-500/20"
                  title="Call Contact"
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>

                {!contact.isPrimary && (
                  <button
                    onClick={() => setPrimaryContact(contact.id)}
                    className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20"
                    title="Set as Primary Emergency Contact"
                  >
                    Make Primary
                  </button>
                )}

                <button
                  onClick={() => deleteContact(contact.id)}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-300 hover:bg-rose-500/20"
                  title="Delete Contact"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
