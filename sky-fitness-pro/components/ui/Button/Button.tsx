'use client';

import { ComponentProps, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = ComponentProps<'button'> & {
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    children: ReactNode;
};

export function Button({
    variant = 'primary',
    fullWidth = false,
    children,
    className = '',
    ...props
}: ButtonProps) {
    return (
        <button
            className={`${styles.base} ${styles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}