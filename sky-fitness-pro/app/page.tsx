import { getCourses } from '@/lib/api';
import { CourseCard } from '@/components/ui/CourseCard/CourseCard';
import { Header } from '@/components/ui/Header/Header';
import { Footer } from '@/components/ui/Footer/Footer';
import Image from 'next/image';
import styles from './page.module.css';

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className={styles.page}>
        <div className={styles.container}>
          <div className={styles.titleWithImage}>
            <h1 className={styles.title}>
              Начните заниматься спортом <br /> и улучшите качество жизни
            </h1>
            <Image
              src="/images/slogan.png"
              alt="SkyFitnessPro slogan"
              width={300}
              height={150}
              className={styles.image}
            />
          </div>

          <div className={styles.grid}>
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                price={course.price}
                image={course.image}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}