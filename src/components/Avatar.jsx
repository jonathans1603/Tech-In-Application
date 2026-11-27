import PropTypes from 'prop-types'

export default function Avatar ({ user, size = 36, ring = false }) {
  const image = (
    <img
      className='avatar'
      src={user?.avatar}
      alt={user?.name || 'Pengguna'}
      width={size}
      height={size}
    />
  )
  return ring ? <span className='ring'>{image}</span> : image
}

Avatar.propTypes = {
  user: PropTypes.shape({ name: PropTypes.string, avatar: PropTypes.string }),
  size: PropTypes.number,
  ring: PropTypes.bool
}
