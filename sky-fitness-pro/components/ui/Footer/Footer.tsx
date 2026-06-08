import styles from './Footer.module.css';

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container mx-auto px-4 py-8">
                <div className={styles.content}>
                    <p className="text-sm">
                        © 2024 SkyFitnessPro. Все права защищены.
                    </p>
                    <div className={styles.links}>
                        <a href="#" className={styles.link}>Политика конфиденциальности</a>
                        <a href="#" className={styles.link}>Контакты</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}