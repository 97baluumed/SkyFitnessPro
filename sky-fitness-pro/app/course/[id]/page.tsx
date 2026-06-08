export default async function CoursePage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Загрузка курса...</h1>
            <div className="bg-gray-100 h-64 rounded-lg animate-pulse" />
            <div className="mt-4 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
        </div>
    );
}