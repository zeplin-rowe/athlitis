import Card from "@/components/ui/Card";
// import ImageCarousel from "@/components/ui/ImageCarousel";

export default function HomePage() {
  return (
    <div className="scroll-smooth">
      {/* Main Landing */}
      <section
        id="home"
        className="min-h-screen flex flex-col justify-center items-center text-center p-8 pt-24"
      >
        <div className="mb-6 text-sm text-gray-500">New · Beta</div>
        <h1 className="text-4xl font-bold mb-4">
          Training, tracked. Progress, simplified.
        </h1>
        <p className="text-gray-700 mb-6">
          Athlitis is a workout tracker for building routines, saving exercises,
          and logging your progress.
        </p>

        {/* <ImageCarousel
          images={[
            "/images/workout1.jpg",
            "/images/workout2.jpg",
            "/images/workout3.jpg",
          ]}
        /> */}

        <div className="flex gap-4 mb-6">
          <a
            href="/routine"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create Routine
          </a>
          <a href="/exercises" className="px-4 py-2 bg-gray-200 rounded">
            Browse Exercises
          </a>
        </div>
        <div className="text-gray-500 text-sm">
          <span className="font-semibold">Pro tip:</span> use the Exercises
          search to find movements quickly.
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="min-h-screen flex flex-col justify-center items-center p-8 space-y-4 pt-24"
      >
        <Card>
          <h3 className="font-bold text-lg">Build Routines</h3>
          <p>Create and save routines for training days.</p>
        </Card>
        <Card>
          <h3 className="font-bold text-lg">Full Exercise DB</h3>
          <p>Search by muscle group, name, or equipment.</p>
        </Card>
        <Card>
          <h3 className="font-bold text-lg">Detailed Logs</h3>
          <p>Save sets, reps, and weights.</p>
        </Card>
      </section>

      {/* About */}
      <section
        id="about"
        className="min-h-screen flex flex-col justify-center items-center p-8 pt-24"
      >
        <Card>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">About Athlitis</h3>
              <p>
                Built as a compact tracking app focused on fast, intuitive
                logging.
              </p>
            </div>
            <div className="text-gray-500 text-sm">
              <div>Made by</div>
              <div>Z</div>
              <div>Fullstack · Fitness nerd</div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
