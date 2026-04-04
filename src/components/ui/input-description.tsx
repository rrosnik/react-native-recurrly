import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Text } from './text';


const variants = cva(cn(
  "text-sm"
), {
  variants: {
    variant: {
      default: cn(),
      destructive: cn("text-destructive"),
    },
    size: {
      "default": "text-base",
      "sm": "text-sm",
      "xs": "text-xs",
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }

})

type InputDescProps = Omit<React.PropsWithChildren<React.ComponentProps<typeof Text>>, "variant"> & VariantProps<typeof variants>;

function InputDesc({ children, className, variant, ...props }: InputDescProps) {
  return (
    <Text
      {...props}
      className={cn(variants({ variant }))}
      variant={"small"}
    >
      {children}
    </Text>
  );
}

export { InputDesc };
