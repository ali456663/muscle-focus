import React, { useState } from 'react'

/**
 * DumbbellIcon – A golden dumbbell SVG that spins 360° on click.
 * Usage: <DumbbellIcon size={18} />
 */
function DumbbellIcon({ size = 18, className = '' }) {
  const [spinning, setSpinning] = useState(false)

  const handleClick = (e) => {
    // Don't prevent default — let the parent Link/button still work
    setSpinning(true)
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 24"
      width={size * 1.8}
      height={size}
      className={`dumbbell-icon ${spinning ? 'dumbbell-spin' : ''} ${className}`}
      onClick={handleClick}
      style={{ flexShrink: 0 }}
      aria-hidden="true"
    >
      {/* Left weight plate (outer) */}
      <rect x="2" y="3" width="8" height="18" rx="2.5" fill="url(#goldGrad)" stroke="#8a6d2b" strokeWidth="0.8" />
      {/* Left weight plate (inner) */}
      <rect x="10" y="5" width="6" height="14" rx="2" fill="url(#goldGrad2)" stroke="#8a6d2b" strokeWidth="0.6" />
      {/* Bar */}
      <rect x="16" y="10" width="32" height="4" rx="2" fill="url(#barGrad)" stroke="#8a6d2b" strokeWidth="0.5" />
      {/* Right weight plate (inner) */}
      <rect x="48" y="5" width="6" height="14" rx="2" fill="url(#goldGrad2)" stroke="#8a6d2b" strokeWidth="0.6" />
      {/* Right weight plate (outer) */}
      <rect x="54" y="3" width="8" height="18" rx="2.5" fill="url(#goldGrad)" stroke="#8a6d2b" strokeWidth="0.8" />
      
      {/* Shine highlights */}
      <rect x="4" y="5" width="2" height="10" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="56" y="5" width="2" height="10" rx="1" fill="rgba(255,255,255,0.25)" />
      
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c84a" />
          <stop offset="50%" stopColor="#b89547" />
          <stop offset="100%" stopColor="#8a6d2b" />
        </linearGradient>
        <linearGradient id="goldGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4ad3c" />
          <stop offset="50%" stopColor="#c9a040" />
          <stop offset="100%" stopColor="#9e7d34" />
        </linearGradient>
        <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9a040" />
          <stop offset="50%" stopColor="#d4b85c" />
          <stop offset="100%" stopColor="#c9a040" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default DumbbellIcon
