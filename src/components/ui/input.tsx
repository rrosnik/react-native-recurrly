import { cn } from '@/lib/utils';
import { Platform, TextInput } from 'react-native';

type InputProps = React.ComponentProps<typeof TextInput> & {
  isValid?: boolean;
};

function Input({ className, isValid, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        'border-input bg-background text-foreground flex h-[3.5em] w-full min-w-0 flex-row items-center rounded-2xl border px-[1em] text-base leading-5 shadow-sm shadow-black/5 sm:h-12',
        props.editable === false &&
        cn(
          'opacity-50',
          Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
        ),
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 aria-invalid:border-destructive'
          ),
          native: 'placeholder:text-muted-foreground/50',
        }),
        cn(
          isValid === false ? 'border-destructive' : isValid === true ? 'border-emerald-700' : 'border-gray-400'
        ),
        className
      )}
      placeholderTextColor={'#666666'}
      {...props}
    />
  );
}

export { Input };
