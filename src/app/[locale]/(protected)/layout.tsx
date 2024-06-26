import React, { ReactNode } from 'react'
import styles from './layout.module.scss'
import { getTranslations } from 'next-intl/server'

export const generateMetadata = async () => {
  const t = await getTranslations({ namespace: 'Metadata.Protected' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

interface PropTypes {
  children: ReactNode
}
const ProtectedLayout = ({ children }: PropTypes) => {
  return <main className={styles.root}>{children}</main>
}

export default ProtectedLayout
