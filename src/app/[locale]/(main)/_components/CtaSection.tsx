import { LinkButton } from '@/components/UI/Button'
import React from 'react'
import cn from 'classnames'
import styles from './CtaSection.module.scss'
import { useTranslations } from 'next-intl'
import { supportLink } from '@/utils/support'

interface PropTypes {
  className?: string
}

// TODO: refactor
const CtaSection = ({ className }: PropTypes) => {
  const t = useTranslations('Index.Cta')

  return (
    <section className={cn(styles.root, className)}>
      <LinkButton
        size="xs"
        variation="primary"
        weight="semiBold"
        link={{ href: '/subtitles' }}
      >
        {t('browse_series')}
      </LinkButton>
      <LinkButton
        size="xs"
        variation="secondary"
        link={{ href: supportLink, openInNewTab: true }}
      >
        {t('support_me')}
      </LinkButton>
    </section>
  )
}

export default CtaSection
