import PropTypes from 'prop-types'

function Svg ({ children, size = 24, fill = 'none', ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill={fill}
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      {...rest}
    >
      {children}
    </svg>
  )
}

Svg.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.number,
  fill: PropTypes.string
}

export const HeartIcon = ({ filled, ...props }) => (
  <Svg fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' />
  </Svg>
)
HeartIcon.propTypes = { filled: PropTypes.bool }

export const CommentIcon = (props) => (
  <Svg {...props}>
    <path d='M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z' />
  </Svg>
)

export const ArrowDownIcon = ({ filled, ...props }) => (
  <Svg strokeWidth={filled ? 2.6 : 1.8} {...props}>
    <path d='M12 5v14M19 12l-7 7-7-7' />
  </Svg>
)
ArrowDownIcon.propTypes = { filled: PropTypes.bool }

export const HomeIcon = (props) => (
  <Svg {...props}>
    <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' />
    <path d='M9 22V12h6v10' />
  </Svg>
)

export const LeaderboardIcon = (props) => (
  <Svg {...props}>
    <path d='M6 20V10M12 20V4M18 20v-6' />
  </Svg>
)

export const PlusIcon = (props) => (
  <Svg {...props}>
    <rect x='3' y='3' width='18' height='18' rx='5' />
    <path d='M12 8v8M8 12h8' />
  </Svg>
)

export const UserIcon = (props) => (
  <Svg {...props}>
    <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
    <circle cx='12' cy='7' r='4' />
  </Svg>
)

export const LogoutIcon = (props) => (
  <Svg {...props}>
    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9' />
  </Svg>
)
