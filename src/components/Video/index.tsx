import React from 'react'
import cn from 'classnames'
import styles from './Video.module.scss'
import { Locale } from '@/types/locale'

interface PropTypes {
  className?: string
  showControls?: boolean
  isMuted?: boolean
  isAutoPlay?: boolean
  isLooping?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  videoSrc: string
  captionsSrc?: string
  captionsLabel?: string
  srcLang?: Locale
  width?: number | string
  height?: number | string
}

const Video = ({
  className,
  showControls = false,
  isMuted = true,
  isAutoPlay = true,
  isLooping = false,
  preload = 'auto',
  videoSrc,
  captionsSrc,
  width = 320,
  height = 240,
  captionsLabel,
  srcLang = 'en',
}: PropTypes) => {
  return (
    <video
      width={width}
      height={height}
      controls={showControls}
      autoPlay={isAutoPlay}
      muted={isMuted}
      loop={isLooping}
      preload={preload}
      className={cn(styles.root, className)}
      aria-label="Video" // Todo: make dynamic
    >
      <source src={videoSrc} type="video/mp4" />
      {captionsSrc && (
        <track
          src={captionsSrc}
          kind="subtitles" // Todo: make dynamic?
          srcLang={srcLang}
          label={captionsLabel}
        />
      )}
      Video tag not supported by your browser. {/*  // Todo: make dynamic */}
    </video>
  )
}

export default Video