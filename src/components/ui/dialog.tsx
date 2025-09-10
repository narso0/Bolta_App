import * as React from "react"
import { Modal, View, Text, Pressable, ViewProps, TextProps } from "react-native"
import { X } from "lucide-react-native"
import { cn } from "@/lib/utils"

// 1. Context to share the modal's open/closed state
interface DialogContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

const useDialog = () => {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("useDialog must be used within a Dialog")
  }
  return context
}

// 2. Main component to provide the context
const Dialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

// 3. The trigger component
const DialogTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = useDialog()
  const child = React.Children.only(children)
  return React.cloneElement(child as React.ReactElement, {
    onPress: () => setOpen(true),
  })
}

// 4. The content that appears in the modal
const DialogContent = React.forwardRef<
  View,
  ViewProps
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = useDialog()

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        onPress={() => setOpen(false)}
        className="flex-1 justify-center items-center bg-black/80 p-4"
      >
        {/* This inner Pressable stops taps inside the modal from closing it */}
        <Pressable> 
          <View
            ref={ref}
            className={cn(
              "w-full max-w-lg gap-4 border bg-card p-6 shadow-lg rounded-lg",
              className
            )}
            {...props}
          >
            {children}
            <Pressable
              onPress={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
  className,
  ...props
}: ViewProps) => (
  <View
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: ViewProps) => (
  <View
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<Text, TextProps>(
    ({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-foreground",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<Text, TextProps>(
  ({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

// We don't need a Portal or Overlay as React Native's Modal handles this.
const DialogPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
const DialogOverlay = () => null

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}