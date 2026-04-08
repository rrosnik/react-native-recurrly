import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { TextInput } from 'react-native';



const inputVariants = cva(
  cn(
    "border border-foreground/20 rounded-2xl",
    "text-base leading-5 font-sans-medium text-foreground placeholder:text-muted-foreground/50",
    "flex flex-row items-center bg-background",
    "h-[3.5em] w-full min-w-0 px-[1em] sm:h-12",
    "shadow-sm shadow-black/5",
  ), {
  variants: {
    variant: {
      default: '',
      error: 'border-destructive',
      success: 'border-emerald-500',
    },

  },
  defaultVariants: {
    variant: 'default',

  }
}
);

type InputProps = React.ComponentProps<typeof TextInput> & VariantProps<typeof inputVariants> & {
  isvalid?: boolean;
}

function Input({ className, variant: _variant, isvalid, ...props }: InputProps) {
  const variant = isvalid === true ? 'success' : isvalid === false ? 'error' : _variant;

  return (
    <TextInput
      placeholderTextColor={variant === 'error' ? '#ff7675bb' : variant === 'success' ? '#28a745bb' : '#666666'}
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Input };
