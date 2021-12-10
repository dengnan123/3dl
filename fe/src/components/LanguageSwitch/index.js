import { Select, Icon } from 'antd'
import { connect } from 'dva'
import { getLocale } from 'umi-plugin-react/locale'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { setLocaleMode } from '../../helpers/storage'

import styles from './index.less'

const currentLang = getLocale()

const ConnectedDropdownSwitch = connect(({ app }) => {
  return {
    screenWidth: app.screenWidth
  }
})(DropdownSwitch)

function LanguageSwitch(props) {
  if (!props.useDropdown) {
    return PlainSwitch(props)
  }

  return <ConnectedDropdownSwitch {...props} />
}

LanguageSwitch.propTypes = {
  useDropdown: PropTypes.bool
}

function PlainSwitch(props) {
  return (
    <div className={styles.switchBox}>
      <span
        className={classnames(styles.switch, { [styles.active]: currentLang === 'zh-CN' })}
        onClick={() => setLocaleMode('zh-CN')}
      >
        简体中文
      </span>
      <span className={styles.marginBoth}>|</span>
      <span
        className={classnames(styles.switch, { [styles.active]: currentLang === 'en-US' })}
        onClick={() => setLocaleMode('en-US')}
      >
        English
      </span>
    </div>
  )
}

function DropdownSwitch(props) {
  const { screenWidth } = props
  if (screenWidth > 800) {
    return (
      <Select
        defaultValue={currentLang}
        style={{ width: 88 }}
        className={styles.select}
        dropdownClassName={styles.dropdownContent}
        onChange={value => setLocaleMode(value)}
        suffixIcon={<Icon type="caret-down" style={{ fontSize: 16, color: '#999' }} />}
      >
        <Select.Option value="zh-CN">简体中文</Select.Option>
        <Select.Option value="en-US">English</Select.Option>
      </Select>
    )
  }
  return (
    <Select
      defaultValue={currentLang}
      style={{ width: 50 }}
      className={styles.select}
      onChange={value => setLocaleMode(value)}
      suffixIcon={<Icon type="caret-down" style={{ fontSize: 16, color: '#999' }} />}
    >
      <Select.Option value="zh-CN">中</Select.Option>
      <Select.Option value="en-US">En</Select.Option>
    </Select>
  )
}

DropdownSwitch.propTypes = {
  screenWidth: PropTypes.number
}

export default LanguageSwitch
