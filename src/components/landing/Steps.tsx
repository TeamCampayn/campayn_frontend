import { motion } from 'framer-motion'

const STEPS = [
  {
    n: '01',
    badges: ['Smart', 'Data-Driven'],
    title: 'AI Matchmaking',
    desc: 'Our engine analyzes 50+ data points to find your perfect creator match.',
  },
  {
    n: '02',
    badges: ['ROI', 'Scalable'],
    title: 'Smart Creator Mix',
    desc: 'Micro, macro, and mega profiles optimized for reach and cost-efficiency.',
  },
  {
    n: '03',
    badges: ['Regional', 'Hyperlocal'],
    title: 'Local Reach',
    desc: '10,000+ verified creators across Tier 2 & 3 cities for hyperlocal marketing.',
  },
  {
    n: '04',
    badges: ['Affordable', 'Transparent'],
    title: 'Flexible Budgets',
    desc: 'Campaigns start at ₹500. No minimums. No hidden agency fees.',
  },
  {
    n: '05',
    badges: ['Secure', 'Gamified'],
    title: 'Trust & Transparency',
    desc: 'Secure escrow wallet, gamified creator tiers, and 24/7 support.',
  },
  {
    n: '06',
    badges: ['Community', 'Inclusive'],
    title: 'Built for Bharat',
    desc: "Democratizing influencer marketing for India's next 500 million.",
  },
]

const STEP_ARTWORK: Record<string, React.ReactNode> = {
  // Step 1: Blue/Indigo Stepped Pyramid
  '01': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="100" cy="180" rx="70" ry="12" fill="#C7D2FE" opacity="0.3" />

      {/* Layer 1 (Base) */}
      <path d="M 40,140 L 100,165 L 160,140 L 100,115 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 40,140 L 100,165 L 100,175 L 40,150 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 100,165 L 160,140 L 160,150 L 100,175 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Layer 2 */}
      <g transform="translate(0, -15)">
        <path d="M 55,127.5 L 100,146.25 L 145,127.5 L 100,108.75 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 55,127.5 L 100,146.25 L 100,156.25 L 55,137.5 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,146.25 L 145,127.5 L 145,137.5 L 100,156.25 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>

      {/* Layer 3 */}
      <g transform="translate(0, -30)">
        <path d="M 70,115 L 100,127.5 L 130,115 L 100,102.5 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 70,115 L 100,127.5 L 100,137.5 L 70,125 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,127.5 L 130,115 L 130,125 L 100,137.5 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>

      {/* Layer 4 (Top) */}
      <g transform="translate(0, -45)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,-45; 0,-50; 0,-45"
          dur="4s"
          repeatCount="indefinite"
        />
        <path d="M 85,102.5 L 100,108.75 L 115,102.5 L 100,96.25 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,102.5 L 100,108.75 L 100,118.75 L 85,112.5 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,108.75 L 115,102.5 L 115,112.5 L 100,118.75 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  // Step 2: Purple Cube Cluster
  '02': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="100" cy="170" rx="65" ry="12" fill="#E9D5FF" opacity="0.3" />

      {/* Back Column (0, -20) - 2 cubes */}
      <g transform="translate(0, -10)">
        {/* Bottom cube */}
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Top cube */}
        <g transform="translate(0, 0)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>

      {/* Left Column (-20, 10) - 2 cubes */}
      <g transform="translate(-20, 10)">
        {/* Bottom cube */}
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Top cube */}
        <g transform="translate(0, 0)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>

      {/* Right Column (20, 10) - 2 cubes */}
      <g transform="translate(20, 10)">
        {/* Bottom cube */}
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Top cube */}
        <g transform="translate(0, 0)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>

      {/* Front Column (0, 30) - 3 cubes */}
      <g transform="translate(0, 20)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,20; 0,14; 0,20"
          dur="3.5s"
          repeatCount="indefinite"
        />
        {/* Bottom cube */}
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Middle cube */}
        <g transform="translate(0, 0)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Top cube */}
        <g transform="translate(0, -20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  ),
  // Step 3: Blue Columns/Towers
  '03': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="100" cy="155" rx="55" ry="10" fill="#BFDBFE" opacity="0.3" />

      {/* Back tower (0, 0) */}
      <g transform="translate(0, 0)">
        <path d="M 100,60 L 115,67.5 L 100,75 L 85,67.5 Z" fill="#EFF6FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 85,67.5 L 100,75 L 100,140 L 85,132.5 Z" fill="#BFDBFE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 100,75 L 115,67.5 L 115,132.5 L 100,140 Z" fill="#3B82F6" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
      </g>
      {/* Left tower (-20, 10) */}
      <g transform="translate(-20, 10)">
        <path d="M 100,50 L 115,57.5 L 100,65 L 85,57.5 Z" fill="#EFF6FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 85,57.5 L 100,65 L 100,140 L 85,132.5 Z" fill="#BFDBFE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 100,65 L 115,57.5 L 115,132.5 L 100,140 Z" fill="#3B82F6" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
      </g>
      {/* Right tower (20, 10) */}
      <g transform="translate(20, 10)">
        <path d="M 100,55 L 115,62.5 L 100,70 L 85,62.5 Z" fill="#EFF6FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 85,62.5 L 100,70 L 100,140 L 85,132.5 Z" fill="#BFDBFE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 100,70 L 115,62.5 L 115,132.5 L 100,140 Z" fill="#3B82F6" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
      </g>
      {/* Front tower (0, 20) */}
      <g transform="translate(0, 20)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,20; 0,12; 0,20"
          dur="5s"
          repeatCount="indefinite"
        />
        <path d="M 100,80 L 115,87.5 L 100,95 L 85,87.5 Z" fill="#EFF6FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 85,87.5 L 100,95 L 100,140 L 85,132.5 Z" fill="#BFDBFE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 100,95 L 115,87.5 L 115,132.5 L 100,140 Z" fill="#3B82F6" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  // Step 4: Purple Stepped Pyramid
  '04': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="100" cy="180" rx="70" ry="12" fill="#E9D5FF" opacity="0.3" />

      {/* Layer 1 (Base) */}
      <path d="M 40,140 L 100,165 L 160,140 L 100,115 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 40,140 L 100,165 L 100,175 L 40,150 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M 100,165 L 160,140 L 160,150 L 100,175 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Layer 2 */}
      <g transform="translate(0, -15)">
        <path d="M 55,127.5 L 100,146.25 L 145,127.5 L 100,108.75 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 55,127.5 L 100,146.25 L 100,156.25 L 55,137.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,146.25 L 145,127.5 L 145,137.5 L 100,156.25 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>

      {/* Layer 3 */}
      <g transform="translate(0, -30)">
        <path d="M 70,115 L 100,127.5 L 130,115 L 100,102.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 70,115 L 100,127.5 L 100,137.5 L 70,125 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,127.5 L 130,115 L 130,125 L 100,137.5 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>

      {/* Layer 4 (Top) */}
      <g transform="translate(0, -45)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,-45; 0,-50; 0,-45"
          dur="4s"
          repeatCount="indefinite"
        />
        <path d="M 85,102.5 L 100,108.75 L 115,102.5 L 100,96.25 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,102.5 L 100,108.75 L 100,118.75 L 85,112.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,108.75 L 115,102.5 L 115,112.5 L 100,118.75 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </svg>
  ),
  // Step 5: Blue/Indigo Cube Cluster
  '05': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="100" cy="170" rx="65" ry="12" fill="#C7D2FE" opacity="0.3" />

      {/* Back Column (0, -20) - 2 cubes */}
      <g transform="translate(0, -10)">
        {/* Bottom cube */}
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Top cube */}
        <g transform="translate(0, 0)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>

      {/* Left Column (-20, 10) - 2 cubes */}
      <g transform="translate(-20, 10)">
        {/* Bottom cube */}
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Top cube */}
        <g transform="translate(0, 0)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>

      {/* Right Column (20, 10) - 2 cubes */}
      <g transform="translate(20, 10)">
        {/* Bottom cube */}
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Top cube */}
        <g transform="translate(0, 0)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>

      {/* Front Column (0, 30) - 3 cubes */}
      <g transform="translate(0, 20)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,20; 0,14; 0,20"
          dur="3.5s"
          repeatCount="indefinite"
        />
        {/* Bottom cube */}
        <g transform="translate(0, 20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Middle cube */}
        <g transform="translate(0, 0)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
        {/* Top cube */}
        <g transform="translate(0, -20)">
          <path d="M 100,75 L 120,85 L 100,95 L 80,85 Z" fill="#E0E7FF" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 80,85 L 100,95 L 100,115 L 80,105 Z" fill="#C7D2FE" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 100,95 L 120,85 L 120,105 L 100,115 Z" fill="#818CF8" stroke="#1E1B4B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  ),
  // Step 6: Purple Columns/Towers (Built for Bharat)
  '06': (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="100" cy="155" rx="55" ry="10" fill="#E9D5FF" opacity="0.3" />

      {/* Back tower (0, 0) */}
      <g transform="translate(0, 0)">
        <path d="M 100,60 L 115,67.5 L 100,75 L 85,67.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,67.5 L 100,75 L 100,140 L 85,132.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,75 L 115,67.5 L 115,132.5 L 100,140 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {/* Left tower (-20, 10) */}
      <g transform="translate(-20, 10)">
        <path d="M 100,50 L 115,57.5 L 100,65 L 85,57.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,57.5 L 100,65 L 100,140 L 85,132.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,65 L 115,57.5 L 115,132.5 L 100,140 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {/* Right tower (20, 10) */}
      <g transform="translate(20, 10)">
        <path d="M 100,55 L 115,62.5 L 100,70 L 85,62.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,62.5 L 100,70 L 100,140 L 85,132.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,70 L 115,62.5 L 115,132.5 L 100,140 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
      {/* Front tower (0, 20) */}
      <g transform="translate(0, 20)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,20; 0,12; 0,20"
          dur="5s"
          repeatCount="indefinite"
        />
        <path d="M 100,80 L 115,87.5 L 100,95 L 85,87.5 Z" fill="#F3E8FF" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 85,87.5 L 100,95 L 100,140 L 85,132.5 Z" fill="#D8B4FE" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M 100,95 L 115,87.5 L 115,132.5 L 100,140 Z" fill="#9333EA" stroke="#1E1B4B" strokeWidth="2.5" strokeLinejoin="round" />
      </g>
    </svg>
  ),
}

export function Steps() {
  return (
    <section className="px-3 py-14 md:px-4 md:py-24">
      <div className="grain rounded-[2.5rem] bg-panel px-6 py-20 md:px-12 md:py-32 border border-zinc-200/40">
        <div className="mx-auto max-w-5xl">
          
          {/* Header Section */}
          <div className="text-center mb-24 md:mb-32">
            <h2 className="font-sans font-extrabold text-4xl md:text-[3.5rem] leading-[1.1] tracking-tight">
              <span className="text-[#818CF8] block mb-2">Steps to Your Progress and</span>
              <span className="text-zinc-500 block">We make you go Viral</span>
            </h2>
          </div>

          {/* Steps Alternating Stack */}
          <div className="space-y-28 md:space-y-40">
            {STEPS.map((s, index) => {
              const isEven = index % 2 === 1
              return (
                <div 
                  key={s.n} 
                  className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center"
                >
                  {/* Left Side (Card) - order-first on mobile, conditionally placed on desktop */}
                  <motion.div
                    className={`w-full flex items-center justify-center p-12 bg-white rounded-[2.5rem] border border-zinc-200/80 shadow-[0_12px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-all duration-300 aspect-square max-w-[420px] md:max-w-[460px] mx-auto ${
                      isEven ? 'md:order-last' : 'md:order-first'
                    }`}
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
                  >
                    {/* Size of illustration container has been increased to fit the card beautifully */}
                    <div className="w-[60%] h-[60%] flex items-center justify-center">
                      {STEP_ARTWORK[s.n]}
                    </div>
                  </motion.div>

                  {/* Right Side (Content) */}
                  <motion.div
                    className={`flex flex-col justify-center text-left ${
                      isEven ? 'md:order-first' : 'md:order-last'
                    }`}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.215, 0.61, 0.355, 1] }}
                  >
                    {/* Big Step Number */}
                    <span className="font-sans font-extrabold text-[5rem] md:text-[6.5rem] text-[#818CF8]/25 leading-none tracking-tighter">
                      {s.n}
                    </span>

                    {/* Badge Pill Container */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {s.badges.map((badge) => (
                        <span 
                          key={badge}
                          className="rounded-full border border-zinc-300 px-3.5 py-0.5 text-[11px] font-medium font-sans text-zinc-500"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Step Title */}
                    <h3 className="font-sans font-bold text-3xl md:text-[2.25rem] text-zinc-900 tracking-tight mt-5 leading-none">
                      {s.title}
                    </h3>

                    {/* Step Description */}
                    <p className="mt-4 text-zinc-500 text-sm md:text-base leading-relaxed max-w-[420px]">
                      {s.desc}
                    </p>
                  </motion.div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
