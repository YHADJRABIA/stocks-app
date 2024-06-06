import React, { CSSProperties, HTMLAttributes, ReactNode } from 'react'
import styles from './Typography.module.scss'
import cn from 'classnames'

type TagType = keyof typeof tagMap

interface PropTypes extends HTMLAttributes<HTMLElement> {
  tag?: TagType
  weight?: 'normal' | 'semiBold' | 'bold'
  align?: 'left' | 'center' | 'right'
  color?: string
  uppercase?: boolean
  className?: string
  children: ReactNode
}

const tagMap = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  small: 'small',
  span: 'span',
} as const

const Typography = ({
  tag = 'p',
  weight = 'normal',
  color,
  uppercase = false,
  align = 'center',
  className,
  children,
  ...rest
}: PropTypes) => {
  const Tag = tagMap[tag]

  const isSemiBold = weight === 'semiBold'

  const PropStyles = {
    fontWeight: isSemiBold ? 600 : weight,
    textAlign: align,
    color,
    textTransform: uppercase ? 'uppercase' : undefined,
  }

  return (
    <Tag
      {...rest}
      style={PropStyles as CSSProperties}
      className={cn(styles.root, className)}
    >
      {children}
    </Tag>
  )
}

export default Typography
