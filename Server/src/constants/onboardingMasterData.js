const countries = [
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' }
];

const currencies = [
  { code: 'AED', symbol: 'د.إ', name: 'United Arab Emirates Dirham' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'GBP', symbol: '£', name: 'British Pound' }
];

const timezones = [
  { name: 'Asia/Dubai', offset: '+04:00' },
  { name: 'Asia/Kolkata', offset: '+05:30' },
  { name: 'UTC', offset: '+00:00' },
  { name: 'America/New_York', offset: '-05:00' },
  { name: 'Europe/London', offset: '+00:00' }
];

const themes = ['light', 'dark'];

const locales = ['en-AE', 'ar-AE', 'en-US', 'en-GB', 'hi-IN'];

module.exports = {
  countries,
  currencies,
  timezones,
  themes,
  locales
};
