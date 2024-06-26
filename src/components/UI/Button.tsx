import { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'
import cn from 'classnames'
import Loader from './Loader'

interface PropTypes extends ButtonHTMLAttributes<HTMLButtonElement> {
  testId?: string
  isLoading?: boolean
  isFullWidth?: boolean
  variation?: 'primary' | 'secondary' | 'regular'
}

const Button = ({
  variation = 'regular',
  children,
  disabled,
  testId,
  isLoading,
  type = 'button',
  isFullWidth = true,
  className,
  ...rest
}: PropTypes) => {
  const isPrimary = variation === 'primary'
  const isSecondary = variation === 'secondary'

  const isClickeable = !(isLoading || disabled)
  return children ? (
    <button
      {...rest}
      type={type}
      className={cn(
        styles.root,
        isPrimary
          ? styles.primary
          : isSecondary
            ? styles.secondary
            : styles.regular,
        { disabled: !isClickeable, fullWidth: isFullWidth },
        className
      )}
      data-testid={testId}
      disabled={!isClickeable}
    >
      {isLoading ? <Loader size={17} /> : children}
    </button>
  ) : null
}

export default Button
