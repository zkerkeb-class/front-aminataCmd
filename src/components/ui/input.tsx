import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  'aria-describedby'?: string
  'aria-invalid'?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, 'aria-describedby': ariaDescribedby, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          ariaInvalid && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
