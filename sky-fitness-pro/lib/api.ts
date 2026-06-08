import type { Course } from '@/types/Course';
import { COURSE_IMAGES } from '@/data/courseImages';

const BASE_URL = 'https://webdev-hw-api.herokuapp.com/api/fitness';

interface RawCourse {
  _id: string;
  nameRU: string;
  description: string;
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) {
    throw new Error(`Ошибка API: ${res.status} ${res.statusText}`);
  }

  const coursesRaw: RawCourse[] = await res.json();
  return coursesRaw.map(course => ({
    id: course._id,
    title: course.nameRU,
    description: course.description,
    price: 2999,
    image: COURSE_IMAGES[course._id] || '/placeholder-course.jpg',
  }));
}

export async function getCourseById(id: string): Promise<Course> {
  const res = await fetch(`${BASE_URL}/courses`);
  if (!res.ok) throw new Error(`Courses not found`);

  const coursesRaw: RawCourse[] = await res.json();
  const courseRaw = coursesRaw.find(c => c._id === id);
  if (!courseRaw) throw new Error(`Course ${id} not found`);

  return {
    id: courseRaw._id,
    title: courseRaw.nameRU,
    description: courseRaw.description,
    price: 2999,
    image: COURSE_IMAGES[courseRaw._id] || '/placeholder-course.jpg',
  };
}