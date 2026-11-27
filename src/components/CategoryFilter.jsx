import PropTypes from 'prop-types'

export default function CategoryFilter ({ categories, selected, onSelect }) {
  return (
    <div className='filters'>
      <button
        type='button'
        className={`chip ${selected === null ? 'chip--active' : ''}`}
        onClick={() => onSelect(null)}
      >
        Semua
      </button>
      {categories.map((category) => (
        <button
          key={category}
          type='button'
          className={`chip ${selected === category ? 'chip--active' : ''}`}
          onClick={() => onSelect(selected === category ? null : category)}
        >
          #{category}
        </button>
      ))}
    </div>
  )
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired
}
