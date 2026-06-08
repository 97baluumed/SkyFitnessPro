const BASE_URL = 'https://webdev-hw-api.vercel.app/api/fitness';

export async function getCourses() {
    const res = await fetch(`${BASE_URL}/courses`);
    if (!res.ok) {
        throw new Error(`Ошибка API: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<{ id: string; title: string; description: string; price: number; image: string }[]>;
}

export async function getCourseById(id: string) {
    const res = await fetch(`${BASE_URL}/courses/${id}`);
    if (!res.ok) throw new Error(`Course ${id} not found`);
    return res.json();
}