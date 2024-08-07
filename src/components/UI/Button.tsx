import { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.scss'
import cn from 'classnames'
import Loader from './Loader'
import Typography, { LinkType, TypographyPropTypes } from './Typography'
import { IconType } from 'react-icons/lib'

interface ButtonPropTypes extends ButtonHTMLAttributes<HTMLButtonElement> {
  testId?: string
  isLoading?: boolean
  isFullWidth?: boolean
  variation?: 'primary' | 'secondary' | 'regular'
  backgroundColor?: string
}

export const Button = ({
  variation = 'regular',
  children,
  disabled,
  testId,
  isLoading,
  type = 'button',
  isFullWidth = true,
  className,
  backgroundColor,
  ...rest
}: ButtonPropTypes) => {
  const isPrimary = variation === 'primary'
  const isSecondary = variation === 'secondary'

  const isClickable = !(isLoading || disabled)
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
        { disabled: !isClickable, fullWidth: isFullWidth },
        className
      )}
      data-testid={testId}
      disabled={!isClickable}
      style={{ backgroundColor: backgroundColor ?? undefined }}
    >
      {isLoading ? <Loader size={17} /> : children}
    </button>
  ) : null
}

interface LinkButtonPropTypes extends TypographyPropTypes {
  testId?: string
  variation?: 'primary' | 'secondary' | 'regular'
  backgroundColor?: string
  icon?: { src: IconType; size?: number; color?: string }
  link: LinkType
}

export const LinkButton = ({
  variation = 'regular',
  testId,
  isFullWidth = true,
  className,
  link = { href: '/', openInNewTab: false },
  backgroundColor,
  children,
  icon,
  ...rest
}: LinkButtonPropTypes) => {
  const isPrimary = variation === 'primary'
  const isSecondary = variation === 'secondary'
  const Icon = icon?.src
  return (
    <Typography
      {...rest}
      link={{ ...link }}
      className={cn(
        styles.root,
        styles.linkButton,
        isPrimary
          ? styles.primary
          : isSecondary
            ? styles.secondary
            : styles.regular,
        {
          fullWidth: isFullWidth,
        },
        isPrimary ? styles.hoverEffect : styles.shadowEffect,
        className
      )}
      data-testid={testId}
      style={{ backgroundColor: backgroundColor ?? undefined }}
    >
      {Icon && (
        <span className={styles.icon}>
          <Icon size={icon.size ?? 18} color={icon.color} />
        </span>
      )}
      {children}
    </Typography>
  )
}
