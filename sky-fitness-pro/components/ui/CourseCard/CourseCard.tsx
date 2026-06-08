'use client';

import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import Image from 'next/image';
import styles from './CourseCard.module.css';

type CourseCardProps = {
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
};

export function CourseCard({ title, description, price, image }: CourseCardProps) {
    const formattedPrice = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
    }).format(price);

    return (
        <Card className={styles.card}>
            <div className={styles.imageContainer}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    onError={() => {
                    }}
                />
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <p className={styles.description}>{description}</p>

                <div className={styles.actions}>
                    <span className={styles.price}>{formattedPrice}</span>
                    <Button variant="primary">
                        Подробнее
                    </Button>
                </div>
            </div>
        </Card>
    );
}