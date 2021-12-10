import styles from './index.less'
import PropTypes from 'prop-types'
function LeftSpan(props) {
  return (
    <span className={styles.leftSpan}>
      <span>|</span>
    </span>
  )
}

LeftSpan.propTypes = {
  text: PropTypes.string
}

export default LeftSpan
