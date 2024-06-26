'use client'
import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
  MdLockOutline as PasswordIcon,
  MdAlternateEmail as EmailIcon,
} from 'react-icons/md'

import {
  BsSendCheck as EmailSentIcon,
  BsXCircle as ErrorIcon,
} from 'react-icons/bs'

import styles from './LoginForm.module.scss'
import Button from '@/components/UI/Button'
import { useShowPassword } from '@/hooks/useShowPassword'
import Separator from '@/components/UI/Separator'
import Field from '@/components/Forms/Field'

import { getErrorMessage } from '@/utils/errors'
import GoogleLogin from '@/components/Auth/GoogleLogin'
import { handleGoogleLogin } from '@/lib/auth/actions'
import InfoBox from '../UI/InfoBox'
import Typography from '../UI/Typography'
import { signIn } from 'next-auth/react'
import { AccountLoginSchema, AccountLoginValidator } from '@/types/schemas/auth'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useInfo from '@/hooks/useInfo'
import LanguageMenu from '../Layout/LanguageMenu'
import { useTranslations } from 'next-intl'

const LoginForm = () => {
  const router = useRouter() // TODO: Redirect if user is logged in

  const [t, t_general, t_zod] = [
    useTranslations('Auth'),
    useTranslations('General'),
    useTranslations('Zod'),
  ]

  const [passwordInputType, ToggleIcon] = useShowPassword({ size: 20 })
  const { info, setInfoMessage } = useInfo()
  const {
    register,
    getFieldState,
    getValues,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AccountLoginSchema>({
    resolver: zodResolver(AccountLoginValidator(t_zod)),
    delayError: 400,
    mode: 'onChange',
  })

  const fieldState = {
    email: getFieldState('email'),
    password: getFieldState('password'),
  }

  const email = getValues('email')

  const InfoIcon = info.type === 'success' ? EmailSentIcon : ErrorIcon // TODO: update

  const handleLogin: SubmitHandler<AccountLoginSchema> = async user => {
    try {
      const res = await signIn('credentials', {
        ...user,
        redirect: false,
      })
      setInfoMessage(getErrorMessage(res?.error), 'error')
    } catch (err) {
      setInfoMessage(getErrorMessage(err), 'error')
    }
  }

  const isValidEmail = !!email?.length && !fieldState.email.error

  return (
    <form
      method="POST"
      onSubmit={handleSubmit(handleLogin)}
      noValidate
      className={styles.root}
    >
      <LanguageMenu />
      <Typography tag="h1" weight="semiBold" className={styles.title}>
        {t('Login.title')}
      </Typography>

      <div className={styles.wrapper}>
        <InfoBox
          className={styles.infoBox}
          icon={<InfoIcon style={{ fontSize: 18 }} />}
          label={info.label}
          type={info.type}
          isShown={!!info.label}
        />

        <Field
          className={styles.emailField}
          autoFocus
          register={register}
          placeholder="email@domain.com"
          type="email"
          name="email"
          label={t('email')}
          subLabel={{
            text: errors?.email?.message,
            isShown: fieldState.email.isTouched,
          }}
          testId="login-email"
          leftIcon={
            <EmailIcon
              style={{ fontSize: 18 }}
              title={t('email')} // TODO: rework this
            />
          }
        />

        <Field
          register={register}
          placeholder={
            passwordInputType === 'password' ? '••••••' : 'MyPa$$word_'
          }
          type={passwordInputType}
          name="password"
          testId="login-password"
          label={t('password')}
          subLabel={{
            text: errors?.password?.message,
            isShown: fieldState.password.isTouched,
          }}
          leftIcon={
            <PasswordIcon
              size={18}
              title={t('password')} // TODO: rework this
            />
          }
          rightIcon={<ToggleIcon />}
        />
        <Link
          className={styles.passwordRecovery}
          href={
            isValidEmail
              ? `/password/recovery?email=${email}`
              : '/password/recovery'
          }
        >
          {t('Login.recover_password')}
        </Link>

        <Button
          variation="primary"
          testId="submit-register-form"
          disabled={!isValid}
          isLoading={isSubmitting}
          type="submit"
        >
          {t('Login.cta')}
        </Button>

        <Separator label={t_general('or')} />
        <GoogleLogin
          disabled={isSubmitting}
          onClick={handleGoogleLogin}
          label={t('continue_with_google')}
        />
      </div>
      <Typography>
        {t('Login.no_account')}{' '}
        <Link href="/register">{t('Login.fallback')} </Link>
      </Typography>
    </form>
  )
}

export default LoginForm
