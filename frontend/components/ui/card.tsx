'use client'

import Image from 'next/image'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Card component for displaying grouped information and actions.
 * 
 * Supports standard, interactive, and elevated variants with configurable padding.
 * Can include images and supports click handlers for interactive cards.
 * Uses compound components (CardHeader, CardBody, CardFooter, CardActions) for composition.
 * 
 * @example
 * ```tsx
 * <Card variant="standard" padding="default">
 *   <CardHeader>Title</CardHeader>
 *   <CardBody>Content</CardBody>
 * </Card>
 * 
 * <Card variant="interactive" onClick={handleClick}>
 *   <CardBody>Clickable content</CardBody>
 * </Card>
 * ```
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'standard' | 'interactive' | 'elevated'
  padding?: 'compact' | 'default' | 'spacious'
  image?: {
    src: string
    alt: string
    width?: number
    height?: number
  }
  onClick?: () => void
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'standard',
      padding = 'default',
      image,
      onClick,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      standard: 'bg-bg-white border border-bg-medium shadow-sm',
      interactive: 'bg-bg-white border border-bg-medium shadow-sm cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99]',
      elevated: 'bg-bg-white border border-bg-medium shadow-lg',
    }

    const paddingClasses = {
      compact: 'p-3',
      default: 'p-4',
      spacious: 'p-6',
    }

    return (
      <div
        ref={ref}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        } : undefined}
        className={cn(
          'rounded-xl transition-all duration-200',
          variantClasses[variant],
          paddingClasses[padding],
          onClick && 'focus:outline-2 focus:outline-accent-orange focus:outline-offset-2',
          className
        )}
        {...props}
      >
        {image && (
          <div className={cn(
            'relative w-full h-48 mb-4 overflow-hidden',
            padding === 'compact' && '-mx-3 -mt-3',
            padding === 'default' && '-mx-4 -mt-4',
            padding === 'spacious' && '-mx-6 -mt-6',
            'first:rounded-t-xl'
          )}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width || 400}
              height={image.height || 192}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Sub-components
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(className)}
      {...props}
    />
  )
)
CardBody.displayName = 'CardBody'

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 pt-4 border-t border-bg-medium', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

const CardActions = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 flex gap-2', className)}
      {...props}
    />
  )
)
CardActions.displayName = 'CardActions'

export { Card, CardHeader, CardBody, CardFooter, CardActions }

