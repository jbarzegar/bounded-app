import { FC, PropsWithChildren } from 'react'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import { Variant } from '@material-ui/core/styles/createTypography'

import { WithVariants } from 'components/types'
import type { HeaderVariants } from 'components/Header'

type TextVariants = Exclude<Variant, HeaderVariants>
type TextProps = PropsWithChildren<WithVariants<TypographyProps, TextVariants>>

export const Text: FC<TextProps> = ({ variant = 'body1', ...props }) => (
  <Typography {...props} variant={variant} />
)
