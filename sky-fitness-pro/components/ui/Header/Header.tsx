'use client';

import Link from 'next/link';
import { Button } from '../Button/Button';
import Image from 'next/image';
import styles from './Header.module.css';

export function Header() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex flex-col gap-1">
                        <Image
                            src="/logo.svg"
                            alt="SkyFitnessPro"
                            width={220}
                            height={35}
                            className={styles.logoImage}
                        />
                        <span className={styles.logoTitle}>
                            Онлайн-тренировки для занятий дома
                        </span>
                    </Link>

                    <Button variant="primary" className={styles.loginButton}>
                        Войти
                    </Button>
                </div>
            </header>
        </div>
    );
}