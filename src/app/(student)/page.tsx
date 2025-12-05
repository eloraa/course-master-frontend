import { CourseList } from './course-list';

export default function Home() {
  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
          <p className="text-muted-foreground mt-2">
            Discover a wide range of courses to enhance your skills
          </p>
        </div>
        <CourseList perPage={12} />
      </div>
    </main>
  );
}
