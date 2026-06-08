import { getCourses } from '@/lib/api';

export default async function HomePage() {
  // const courses = await getCourses(); // раскомментируем позже

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Курсы</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full text-center text-gray-500">
          Курсы загружаются...
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        aria-label="Наверх"
      >
        ↑
      </button>
    </div>
  );
}