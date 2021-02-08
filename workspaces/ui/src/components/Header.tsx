import { FC, PropsWithChildren } from 'react'
import Typography, { TypographyProps } from '@material-ui/core/Typography'
import { WithVariants } from 'components/types'

export type HeaderVariants =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'

export type HeaderProps = PropsWithChildren<
  WithVariants<TypographyProps, HeaderVariants>
>

export const Header: FC<HeaderProps> = ({ variant = 'h3', ...props }) => (
  <Typography {...props} variant={variant} />
)
