'use client';

import {
  FieldPath,
  FieldValues,
  UseFormReturn,
  useFormContext,
  FormProvider,
} from 'react-hook-form';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
  children: ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  form,
  children,
  className,
  onSubmit,
  ...props
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit || form.handleSubmit(() => {})}
        className={className}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}

interface FormItemProps {
  className?: string;
  children: ReactNode;
}

export function FormItem({ className, children }: FormItemProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
}

interface FormLabelProps {
  className?: string;
  children: ReactNode;
  required?: boolean;
}

export function FormLabel({ className, children, required }: FormLabelProps) {
  return (
    <label className={cn('text-sm font-medium leading-none', className)}>
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

interface FormControlProps {
  className?: string;
  children: ReactNode;
}

export function FormControl({ className, children }: FormControlProps) {
  return (
    <div className={cn('mt-1', className)}>
      {children}
    </div>
  );
}

interface FormDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function FormDescription({ className, children }: FormDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-500', className)}>
      {children}
    </p>
  );
}

interface FormMessageProps {
  className?: string;
  children?: ReactNode;
}

export function FormMessage({ className, children }: FormMessageProps) {
  return (
    <p className={cn('text-sm font-medium text-red-500', className)}>
      {children}
    </p>
  );
}

interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  children: ReactNode;
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ name, children }: FormFieldProps<TFieldValues, TName>) {
  // Make this component work even when not inside a FormProvider
  const context = useFormContext<TFieldValues>();

  // If we're not in a form context, just render the children
  if (!context) {
    return (
      <FormItem>
        {children}
      </FormItem>
    );
  }

  const { formState } = context;
  const error = formState.errors[name];

  return (
    <FormItem>
      {children}
      {error?.message && (
        <FormMessage>
          {error.message as string}
        </FormMessage>
      )}
    </FormItem>
  );
}
