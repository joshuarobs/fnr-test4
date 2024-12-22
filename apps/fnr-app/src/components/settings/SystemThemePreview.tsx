import React from 'react';

// System theme preview component displaying a mockup of the application's system theme interface
// showing both light and dark modes side by side to represent system theme following
export const SystemThemePreview = () => {
  return (
    <svg
      viewBox="0 0 230 120"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_778_3455)">
        <path
          d="M230 120L90 120L140 -2.38656e-07L230 0L230 120Z"
          fill="#161B22"
        />
        <path
          d="M167.917 50C169.067 50 170 50.9461 170 52.1132V103.887C170 105.054 169.067 106 167.917 106H95.8334L119.167 50H167.917Z"
          fill="#363D44"
        />
        <rect x="144" y="90" width="16" height="6" rx="3" fill="#5C6087" />
        <rect x="124" y="90" width="16" height="6" rx="3" fill="#838D9B" />
        <path
          opacity="0.6"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M230 0H140L130 24H230V0Z"
          fill="#484F58"
        />
        <rect x="190" y="32" width="20" height="6" rx="3" fill="#43465E" />
        <rect x="180" y="50" width="30" height="40" rx="2" fill="#363D44" />
        <circle cx="205" cy="12" r="5" fill="#8B949E" />
        <rect
          opacity="0.9"
          x="160"
          y="32"
          width="10"
          height="10"
          rx="3"
          fill="#D73A49"
        />
        <rect
          opacity="0.9"
          x="147"
          y="32"
          width="10"
          height="10"
          rx="3"
          fill="#34D058"
        />
        <path d="M0 0H140L90 120H0V0Z" fill="white" />
        <path
          d="M20 103.887C20 105.054 20.9327 106 22.0833 106H95.8333L119.167 50H22.0833C20.9327 50 20 50.9461 20 52.1132V103.887Z"
          fill="#F6F8FA"
        />
        <path
          opacity="0.6"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M140 0H0V24H130L140 0Z"
          fill="#F6F8FA"
        />
        <rect x="10" y="9" width="40" height="6" rx="3" fill="#D9D9D9" />
        <rect x="20" y="34" width="50" height="6" rx="3" fill="#D9D9D9" />
        <rect x="30" y="58" width="30" height="4" rx="2" fill="#D9D9D9" />
        <rect x="30" y="70" width="70" height="4" rx="2" fill="#D9D9D9" />
        <rect x="30" y="78" width="50" height="4" rx="2" fill="#D9D9D9" />
        <rect x="62" y="9" width="40" height="6" rx="3" fill="#D9D9D9" />
      </g>
      <defs>
        <clipPath id="clip0_778_3455">
          <rect width="230" height="120" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
