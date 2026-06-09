import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite, clearSearch } from '../../store/venueSlice';
import { MapPin, Users, Heart, Star, ChevronRight, RefreshCw } from 'lucide-react';

export default function CuratedExperiences({ onBookClick }) {
  const dispatch = useDispatch();

  // Select state from store
  const venues = useSelector((state) => state.venue.venues);
  const favorites = useSelector((state) => state.venue.favorites);
  const searchResults = useSelector((state) => state.venue.searchResults);

  // Determine which venues to show
  const isSearchActive = searchResults !== null;
  const displayVenues = isSearchActive ? searchResults : venues;

  // Specific venues for the screenshot collage layout
  const crystalWaterfront = venues.find(v => v.id === 'crystal-waterfront');
  const skylineLoft = venues.find(v => v.id === 'skyline-loft');
  const villaRosa = venues.find(v => v.id === 'villa-rosa');

  // Handle bookmarking click
  const handleFavoriteClick = (e, venueId) => {
    e.stopPropagation();
    dispatch(toggleFavorite(venueId));
  };

  const renderCardOverlay = (venue, isLeftTall = true) => {
    const isFavorited = favorites.includes(venue.id);
    return (
      <div
        className="card-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, rgba(11, 5, 29, 0.85) 0%, rgba(11, 5, 29, 0.2) 50%, rgba(11, 5, 29, 0.05) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          color: '#ffffff',
          zIndex: 2
        }}
      >
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          {venue.isTopRated && isLeftTall ? (
            <span className="top-rated-badge">
              Top Rated
            </span>
          ) : <span />}

          <button
            onClick={(e) => handleFavoriteClick(e, venue.id)}
            className="hover-action-heart"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isFavorited ? '#ef4444' : '#ffffff',
              transition: 'var(--transition-fast)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Heart size={18} style={{ fill: isFavorited ? '#ef4444' : 'none' }} />
          </button>
        </div>

        {/* Bottom Details */}
        <div>
          <h4 style={{
            fontSize: isLeftTall ? '1.4rem' : '1.1rem',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            marginBottom: '4px',
            lineHeight: '1.3'
          }}>
            {venue.name}
          </h4>

          {isLeftTall ? (
            /* Left Tall Card: white outlines for MapPin and Capacity count */
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.85rem', color: '#f1f5f9', marginTop: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={14} style={{ color: '#ffffff', opacity: 0.9 }} />
                <span>{venue.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Users size={14} style={{ color: '#ffffff', opacity: 0.9 }} />
                <span>{venue.capacity}</span>
              </div>
            </div>
          ) : (
            /* Right Smaller Cards: Location text only, no icons and no capacity text */
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px', fontWeight: '400' }}>
              {venue.location}
            </div>
          )}

          {/* Quick Book Button & Price - Slides up on Hover */}
          <div className="hover-action-book" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onBookClick(venue); }}
              style={{
                background: 'var(--accent-teal)',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600',
                transition: 'var(--transition-fast)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--accent-teal-hover)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'var(--accent-teal)'}
            >
              Book Now
            </button>
            <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-gold)' }}>
              ${venue.price}<span style={{ fontSize: '0.75rem', fontWeight: '400', color: '#cbd5e1' }}>/day</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="curated-experiences" style={{ padding: '100px 0 60px', background: 'var(--bg-slate)' }}>
      <div style={{ maxWidth: '1440px', width: '94%', margin: '0 auto' }}>

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '36px' }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2.2rem',
              fontWeight: '800',
              color: 'var(--primary-dark)',
              marginBottom: '8px'
            }}>
              {isSearchActive ? 'Search Results' : 'Curated Experiences'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              {isSearchActive
                ? `Showing ${displayVenues.length} spaces matching your criteria.`
                : 'Hand-picked venues with flawless reputation and premium amenities.'
              }
            </p>
          </div>

          {isSearchActive ? (
            <button
              onClick={() => dispatch(clearSearch())}
              style={{
                color: 'var(--accent-teal)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.95rem'
              }}
            >
              <RefreshCw size={16} />
              Reset filters
            </button>
          ) : (
            <a href="#all-venues" style={{
              color: 'var(--accent-teal)',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.95rem'
            }}>
              View all venues
              <ChevronRight size={16} />
            </a>
          )}
        </div>

        {/* Collage Display / Search Grid */}
        {isSearchActive || !crystalWaterfront || !skylineLoft || !villaRosa ? (
          /* Search Grid View */
          displayVenues.length === 0 ? (
            <div style={{
              background: '#ffffff',
              borderRadius: 'var(--border-radius-lg)',
              padding: '60px',
              textAlign: 'center',
              border: '1px dashed var(--border-light)'
            }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '16px' }}>No venues found matching your search.</p>
              <button
                onClick={() => dispatch(clearSearch())}
                style={{
                  background: 'var(--primary-dark)',
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {displayVenues.map((venue) => (
                <div
                  key={venue.id}
                  className="venue-card"
                  style={{
                    height: '350px'
                  }}
                >
                  <img
                    src={venue.image}
                    alt={venue.name}
                  />
                  {renderCardOverlay(venue, true)}
                </div>
              ))}
            </div>
          )
        ) : (
          /* High-Fidelity Screenshots Collage Layout */
          <div
            className="collage-container"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "20px",
              width: "100%",
              maxWidth: "100%",
              margin: "0 auto",
            }}
          >
            {/* LEFT LARGE IMAGE */}
            <div
              className="venue-card"
              style={{
                height: "560px",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={crystalWaterfront.image}
                alt={crystalWaterfront.name}
                style={{
                  width: "100%",
                  height: "560px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              {renderCardOverlay(crystalWaterfront, true)}
            </div>

            {/* RIGHT COLUMN */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                height: "560px",
              }}
            >
              {/* TOP CARD */}
              <div
                className="venue-card"
                style={{
                  height: "270px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={skylineLoft.image}
                  alt={skylineLoft.name}
                  style={{
                    width: "100%",
                    height: "270px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {renderCardOverlay(skylineLoft, false)}
              </div>

              {/* BOTTOM CARD */}
              <div
                className="venue-card"
                style={{
                  height: "270px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={villaRosa.image}
                  alt={villaRosa.name}
                  style={{
                    width: "100%",
                    height: "270px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {renderCardOverlay(villaRosa, false)}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
