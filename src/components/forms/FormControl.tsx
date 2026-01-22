// src/components/forms/FormControl.tsx
import { useMemo } from 'react';
import { FieldValues, UseFormRegister, FieldErrors, Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function FormControl<T extends FieldValues>({
    label,
    formName,
    type,
    autoComplete,
    placeholder,
    register,
    errors,
    name
}: {
    label: string;
    formName: string;
    type?: React.HTMLInputTypeAttribute;
    autoComplete?: React.HTMLInputAutoCompleteAttribute;
    placeholder?: string;
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    name: Path<T>;
}) {
    const id = useMemo(() => `${formName}-${name}`, [formName, name]);
    const err = useMemo(() => errors[name], [errors, name]);
    const errMsg = useMemo(() => errors[name]?.message, [errors, name]);
    return (
        <div className='space-y-1 text-sm'>
            <Label
                htmlFor={id}
                className='font-semibold text-white'
            >
                {label}
            </Label>
            <Input
                id={id}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                {...register(name)}
            />
            {err && <p className='text-xs text-red-500'>{errMsg as string}</p>}
        </div>
    );
}
