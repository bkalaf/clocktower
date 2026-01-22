/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/LoginForm.tsx
import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Link, LinkProps } from '@tanstack/react-router';
import { z } from 'zod';

import { login } from '@/lib/api';
import { FormControl } from './FormControl';
import { Modal } from '../Modal';
import { useInvalidateAuth } from '../useInvalidateAuth';

const loginSchema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
    // onSuccess: () => Promise<void> | void;
    returnTo?: string;
};

export function LoginFormControl({
    formName,
    safeReturnTo,
    redir
}: {
    formName: string;
    safeReturnTo?: string;
    redir: LinkProps['to'];
}) {
    return function LoginFormControls(form: UseFormReturn<LoginFormValues>) {
        const {
            register,
            formState: { errors }
        } = form;
        return (
            <div className='space-y-1 text-sm'>
                <FormControl
                    label='Email'
                    formName={formName}
                    register={register}
                    errors={errors}
                    name='email'
                    type='email'
                    autoComplete='email'
                    placeholder='you@example.com'
                />
                <FormControl
                    label='Password'
                    formName={formName}
                    register={register}
                    errors={errors}
                    name='password'
                    type='password'
                />
                {safeReturnTo ?? (
                    <div className='flex justify-end text-sm'>
                        <Link
                            to={redir}
                            search={{ returnTo: safeReturnTo as any } as any}
                            className='text-cyan-400 hover:text-cyan-300'
                        >
                            Forgot password?
                        </Link>
                    </div>
                )}
            </div>
        );
    };
}

export function LoginForm({ returnTo }: LoginFormProps) {
    const invalidate = useInvalidateAuth();
    const onSubmit = useCallback(async (values: { email: string; password: string }) => {
        const result = await login(values.email, values.password);
        if (!result.ok) {
            throw new Error('login unsuccessful');
        }
    }, []);
    return (
        <Modal
            zodSchema={loginSchema}
            defaultValues={{ email: '', password: '' }}
            defaultErrorMsg='Unable to log in'
            invalidate={invalidate}
            onSubmit={onSubmit}
        >
            {LoginFormControl({
                redir: '/forgot-password',
                safeReturnTo: returnTo,
                formName: 'login'
            })}
        </Modal>
    );
}
// export function LoginForm({ onSuccess, returnTo }: LoginFormProps) {
//     const safeReturnTo = returnTo ?? '/';
//     const [serverError, setServerError] = useState<string | null>(null);
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors, isSubmitting }
//     } = useForm<LoginFormValues>({
//         resolver: zodResolver(loginSchema),
//         defaultValues: {
//             email: '',
//             password: ''
//         }
//     });

//     return (
//         <form
//             className='space-y-4'
//             onSubmit={handleSubmit(async (values) => {
//                 setServerError(null);
//                 try {
//                     await login(values.email, values.password);
//                     reset();
//                     await onSuccess();
//                 } catch (error) {
//                     const message = error instanceof Error ? error.message : 'Unable to log in';
//                     setServerError(message);
//                 }
//             })}
//         >
//             <div className='space-y-1 text-sm'>
//                 <Label
//                     htmlFor='login-email'
//                     className='font-semibold text-white'
//                 >
//                     E-mail
//                 </Label>
//                 <Input
//                     id='login-email'
//                     type='email'
//                     autoComplete='email'
//                     placeholder='you@example.com'
//                     {...register('email')}
//                 />
//                 {errors.email && <p className='text-xs text-red-500'>{errors.email.message}</p>}
//             </div>
//             <div className='space-y-1 text-sm'>
//                 <Label
//                     htmlFor='login-password'
//                     className='font-semibold text-white'
//                 >
//                     Password
//                 </Label>
//                 <Input
//                     id='login-password'
//                     type='password'
//                     autoComplete='current-password'
//                     {...register('password')}
//                 />
//                 {errors.password && <p className='text-xs text-red-500'>{errors.password.message}</p>}
//             </div>
//             <div className='flex justify-end text-sm'>
//                 <Link
//                     to='/forgot-password'
//                     search={{ returnTo: safeReturnTo }}
//                     className='text-cyan-400 hover:text-cyan-300'
//                 >
//                     Forgot password?
//                 </Link>
//             </div>
//             {serverError && <p className='text-sm text-red-500'>{serverError}</p>}
//             <Button
//                 type='submit'
//                 disabled={isSubmitting}
//                 className='w-full'
//             >
//                 {isSubmitting ? 'Logging in…' : 'Log in'}
//             </Button>
//         </form>
//     );
// }
