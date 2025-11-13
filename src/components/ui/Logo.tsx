/**
 * LUMEN Logo Component
 *
 * A mathematically perfect, minimal mark that embodies:
 * - Light (lumen = unit of luminous flux)
 * - Precision (geometric perfection)
 * - Clarity (brutal minimalism)
 *
 * The logo is a single circle divided into quarters,
 * representing the four quarters of a day, with a golden
 * line suggesting illumination and enlightenment.
 */

import React from 'react'

interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
  variant?: 'light' | 'dark' | 'gold'
}

export const Logo: React.FC<LogoProps> = ({
  size = 40,
  showText = true,
  className = '',
  variant = 'dark',
}) => {
  const colors = {
    light: {
      primary: '#FFFFFF',
      accent: '#D4AF37',
    },
    dark: {
      primary: '#000000',
      accent: '#D4AF37',
    },
    gold: {
      primary: '#D4AF37',
      accent: '#B8941F',
    },
  }

  const color = colors[variant]
  const textWidth = showText ? size * 3 : 0
  const totalWidth = size + (showText ? textWidth + size * 0.4 : 0)

  return (
    <svg
      width={totalWidth}
      height={size}
      viewBox={`0 0 ${totalWidth} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="LUMEN"
    >
      {/* Logo Mark - The Illuminated Circle */}
      <g>
        {/* Outer circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          stroke={color.primary}
          strokeWidth="2"
          fill="none"
        />

        {/* Diagonal division line (representing light ray) */}
        <line
          x1={size / 2}
          y1={2}
          x2={size / 2}
          y2={size - 2}
          stroke={color.accent}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Horizontal division line */}
        <line
          x1={2}
          y1={size / 2}
          x2={size - 2}
          y2={size / 2}
          stroke={color.primary}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Center point - the source of light */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={3}
          fill={color.accent}
        />
      </g>

      {/* Wordmark - LUMEN in custom geometric type */}
      {showText && (
        <g transform={`translate(${size + size * 0.4}, 0)`}>
          {/* L */}
          <path
            d={`
              M 0 ${size * 0.2}
              L 0 ${size * 0.8}
              L ${size * 0.3} ${size * 0.8}
            `}
            stroke={color.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* U */}
          <path
            d={`
              M ${size * 0.45} ${size * 0.2}
              L ${size * 0.45} ${size * 0.6}
              Q ${size * 0.45} ${size * 0.8} ${size * 0.6} ${size * 0.8}
              Q ${size * 0.75} ${size * 0.8} ${size * 0.75} ${size * 0.6}
              L ${size * 0.75} ${size * 0.2}
            `}
            stroke={color.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* M */}
          <path
            d={`
              M ${size * 0.9} ${size * 0.8}
              L ${size * 0.9} ${size * 0.2}
              L ${size * 1.05} ${size * 0.5}
              L ${size * 1.2} ${size * 0.2}
              L ${size * 1.2} ${size * 0.8}
            `}
            stroke={color.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* E */}
          <path
            d={`
              M ${size * 1.35} ${size * 0.2}
              L ${size * 1.35} ${size * 0.8}
              L ${size * 1.6} ${size * 0.8}
              M ${size * 1.35} ${size * 0.5}
              L ${size * 1.55} ${size * 0.5}
            `}
            stroke={color.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* N */}
          <path
            d={`
              M ${size * 1.75} ${size * 0.8}
              L ${size * 1.75} ${size * 0.2}
              L ${size * 1.95} ${size * 0.8}
              L ${size * 1.95} ${size * 0.2}
            `}
            stroke={color.primary}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      )}
    </svg>
  )
}

/**
 * Logo Icon - Just the mark, no text
 */
export const LogoIcon: React.FC<Omit<LogoProps, 'showText'>> = (props) => (
  <Logo {...props} showText={false} />
)

/**
 * Logo Animated - With subtle entrance animation
 */
export const LogoAnimated: React.FC<LogoProps> = (props) => (
  <div className="animate-fade-in">
    <Logo {...props} />
  </div>
)
