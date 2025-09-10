import * as React from "react"
import { View, Text, ViewProps, TextProps } from "react-native"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background",
        destructive: "border-destructive/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// We use a Context to pass the variant down to the title and description
const AlertContext = React.createContext<{ variant?: VariantProps<typeof alertVariants>["variant"] }>({})

const useAlertContext = () => {
    const context = React.useContext(AlertContext)
    if (!context) {
        throw new Error("useAlertContext must be used within an Alert")
    }
    return context
}

const Alert = React.forwardRef<
  View,
  ViewProps & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <AlertContext.Provider value={{ variant }}>
    <View
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  </AlertContext.Provider>
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  Text,
  TextProps
>(({ className, ...props }, ref) => {
  const { variant } = useAlertContext();
  return (
      <Text
        ref={ref}
        className={cn(
            "mb-1 font-medium leading-none tracking-tight",
            variant === "destructive" && "text-destructive",
            className
        )}
        {...props}
      />
  )
})
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  Text,
  TextProps
>(({ className, ...props }, ref) => {
    const { variant } = useAlertContext();
    return (
      <Text
        ref={ref}
        className={cn(
            "text-sm text-foreground",
            variant === "destructive" && "text-destructive",
            className
        )}
        {...props}
      />
    )
})
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }