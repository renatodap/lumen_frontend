module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0A0E1A',
        'bg-surface': '#141824',
        'bg-hover': '#1F2937',
        'accent': '#F5E6D3',
        'accent-hover': '#E8D5B8',
        'text-primary': '#E8EAF0',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },
      borderRadius: {
        'card': '8px',
        'button': '4px',
      },
    },
  },
  plugins: [],
}
