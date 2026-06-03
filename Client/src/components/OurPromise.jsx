import React from 'react';
import { CreditCard, Headphones, Check, Sparkles } from 'lucide-react';

export default function OurPromise() {
  return (
    <section className="promise-section" style={{ padding: '60px 0', background: '#f8fafc', overflow: 'hidden' }}>
      <div className="container promise-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        
        {/* Left Side: Value Propositions */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.85rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: '#b88e25',
            letterSpacing: '2.5px',
            display: 'block',
            marginBottom: '16px'
          }}>
            OUR PROMISE
          </span>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--primary-dark)',
            lineHeight: '1.25',
            marginBottom: '40px',
            letterSpacing: '-0.5px'
          }}>
            Elevating Every Stage of Your Planning Journey
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Feature 1 */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: '#0a041c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1.5px solid rgba(255,255,255,0.1)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <Check size={22} style={{ strokeWidth: '3px', color: '#ffffff' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', fontWeight: '700', marginBottom: '6px' }}>
                  Vetted Excellence
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Every venue undergoes a rigorous 50-point inspection to ensure it meets our elite standards for hygiene, tech, and service.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: '#0d9488',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: 'var(--shadow-md)'
              }}>
                <CreditCard size={22} style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', fontWeight: '700', marginBottom: '6px' }}>
                  Transparent Pricing
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  No hidden fees. What you see is the final price, including taxes and standard cleaning services.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: '#1e1346',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1.5px solid rgba(255,255,255,0.1)',
                boxShadow: 'var(--shadow-md)'
              }}>
                <Headphones size={22} style={{ color: '#ffffff' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', fontWeight: '700', marginBottom: '6px' }}>
                  Concierge Support
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Access our 24/7 VIP concierge team for any assistance during your booking or event management process.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Element */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=900&q=80" alt="Our Promise" style={{ width: '100%', maxWidth: '500px', height: 'auto', borderRadius: '24px', boxShadow: 'var(--shadow-md)' }} />
          </div>

      </div>
    </section>
  );
}
