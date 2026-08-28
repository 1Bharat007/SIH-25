'use client';

import React, { useState } from 'react';
import { Users, Plus, Trash2, Phone, Star } from 'lucide-react';

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
      <div className="h-40 animate-pulse rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-6" />
    );
  }

  return (
    <div className="rounded-[8px] border border-[#DADCE0] bg-[#FFFFFF] p-5 shadow-[0_1px_2px_0_rgba(60,64,67,0.08)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#DADCE0] pb-3">
        <div>
          <h3 className="text-[15px] font-medium text-[#202124] flex items-center gap-2">
            <Users className="h-4 w-4 text-[#0B3D91]" />
            <span>Designated Emergency Contacts ({contacts.length})</span>
          </h3>
          <p className="text-[12px] text-[#5F6368]">
            Notified with GPS location and altitude during an SOS trigger
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] px-3 py-1.5 text-[12px] font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Contact</span>
          </button>
        )}
      </div>

      {/* Add Contact Form (Google Outlined Field Style) */}
      {isAdding && (
        <form
          onSubmit={handleSaveContact}
          className="rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] p-4 space-y-3"
        >
          <div className="flex items-center justify-between border-b border-[#DADCE0] pb-2">
            <h4 className="text-[13px] font-medium text-[#202124]">
              Add New Emergency Contact
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-[12px] text-[#5F6368] hover:text-[#202124]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-[#5F6368] mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Sharma"
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#5F6368] mb-1">
                Relationship
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              >
                <option value="Family">Family Member</option>
                <option value="Friend">Friend</option>
                <option value="Tour Guide">Tour Guide / Driver</option>
                <option value="Colleague">Colleague</option>
                <option value="Hotel/Homestay">Hotel / Homestay Host</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#5F6368] mb-1">
                Phone Number (with +91) *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[#5F6368] mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@example.com"
                className="w-full h-10 px-3 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[13px] text-[#202124] focus:outline-none focus:border-[#0B3D91]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-1 text-[12px] text-[#5F6368]">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyViaSms}
                onChange={(e) => setNotifyViaSms(e.target.checked)}
                className="rounded accent-[#0B3D91]"
              />
              <span>Send SMS Alert</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyViaWhatsapp}
                onChange={(e) => setNotifyViaWhatsapp(e.target.checked)}
                className="rounded accent-[#0B3D91]"
              />
              <span>Send WhatsApp Location</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#DADCE0]">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-[4px] border border-[#DADCE0] bg-[#FFFFFF] text-[#5F6368] text-[12px] font-medium hover:bg-[#F8F9FA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-[4px] bg-[#0B3D91] hover:bg-[#082E6E] text-[#FFFFFF] text-[12px] font-medium"
            >
              Save Contact
            </button>
          </div>
        </form>
      )}

      {/* Contacts List */}
      <div className="space-y-2.5">
        {contacts.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between p-3 rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] hover:bg-[#FFFFFF] transition-colors text-[13px]"
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#202124]">{c.name}</span>
                <span className="rounded-full bg-[#E8F0FE] px-2 py-0.2 text-[10px] font-medium text-[#0B3D91] border border-[#D2E3FC]">
                  {c.relationship}
                </span>
                {c.isPrimary && (
                  <span className="rounded-full bg-[#E6F4EA] px-2 py-0.2 text-[10px] font-medium text-[#137333] border border-[#CEEAD6]">
                    Primary
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#5F6368] flex items-center gap-2">
                <Phone className="w-3 h-3 text-[#5F6368]" />
                <span>{c.phone}</span>
                {c.email && <span>• {c.email}</span>}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {!c.isPrimary && (
                <button
                  onClick={() => setPrimaryContact(c.id)}
                  className="p-1 rounded-[4px] text-[#5F6368] hover:text-[#0B3D91] hover:bg-[#FFFFFF] border border-transparent hover:border-[#DADCE0]"
                  title="Set as primary"
                >
                  <Star className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => deleteContact(c.id)}
                className="p-1 rounded-[4px] text-[#5F6368] hover:text-[#D93025] hover:bg-[#FFFFFF] border border-transparent hover:border-[#DADCE0]"
                title="Remove contact"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {contacts.length === 0 && !isAdding && (
          <div className="p-6 text-center text-[#5F6368] border border-dashed border-[#DADCE0] rounded-[4px] space-y-1">
            <p className="text-[13px] font-medium text-[#202124]">No emergency contacts registered.</p>
            <p className="text-[12px]">Add at least one family member or travel partner for automated SOS broadcast.</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 px-3 py-1.5 rounded-[4px] bg-[#0B3D91] text-[#FFFFFF] text-[12px] font-medium hover:bg-[#082E6E]"
            >
              Add First Contact
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
