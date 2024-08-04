import React from 'react'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Layout/Header/index'
import Footer from '@/components/Layout/Footer'
import { getUserSession } from '@/utils/session'
import { getNextLocale } from '@/utils/cookies'
import HeroBanner from '@/components/HeroBanner'
import styles from './not-found.module.scss'
import Typography from '@/components/UI/Typography'
import { LinkButton } from '@/components/UI/Button'
import { MdOutlineKeyboardBackspace as BackIcon } from 'react-icons/md'

// TODO: fix "Unable to find `next-intl` locale because the middleware didn't run on this request. See https://next-intl-docs.vercel.app/docs/routing/middleware#unable-to-find-locale. The `notFound()` function will be called as a result."

const SVG_PATH = '/assets/ice-fishing.svg'

const NotFoundPage = async () => {
  const locale = getNextLocale()
  const t = await getTranslations({ locale, namespace: 'NotFound' })
  const user = await getUserSession()
  return (
    <>
      <Header isConnected={!!user} />
      <main className={styles.root}>
        <HeroBanner
          image={SVG_PATH}
          imageAlt="404"
          title={t('page_not_found')}
          description={t('verify_route')}
          className={styles.heroBanner}
          ctaElements={
            <LinkButton
              link={{ href: '/' }}
              size="s"
              variation="primary"
              weight="semiBold"
              className={styles.cta}
              icon={{ src: BackIcon, size: 22 }}
            >
              {t('back_to_homepage')}
            </LinkButton>
          }
        />
      </main>
      <Typography
        size="s"
        className={styles.credits}
        color="var(--primary-blue-color)"
        link={{ href: 'https://storyset.com/', openInNewTab: true }}
      >
        {t('storyset_credit')}
      </Typography>
      <Footer />
    </>
  )
}

export default NotFoundPage
