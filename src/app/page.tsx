import Card from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div>
      {/* Main Landing */}
      <section>
        <div>
          <div>New · Beta</div>

          <h1>Training, tracked. Progress, simplified.</h1>

          <p>
            Athlitis is a workout tracker for building routines, saving
            exercises, and logging your progress.
          </p>

          <div>
            <a href="/routine">Create Routine</a>
            <a href="/exercises">Browse Exercises</a>
          </div>

          <div>
            <span>Pro tip:</span> use the Exercises search to find movements
            quickly.
          </div>
        </div>

        <div></div>
      </section>

      {/* Features */}
      <section>
        <Card>
          <h3>Build Routines</h3>
          <p>Create and save routines for training days.</p>
        </Card>

        <Card>
          <h3>Full Exercise DB</h3>
          <p>Search by muscle group, name, or equipment.</p>
        </Card>

        <Card>
          <h3>Detailed Logs</h3>
          <p>Save sets, reps, and weights.</p>
        </Card>
      </section>

      {/* About Box */}
      <section>
        <Card>
          <div>
            <div>
              <h3>About Athlitis</h3>
              <p>
                Built as a compact tracking app focused on fast, intuitive
                logging.
              </p>
            </div>

            <div>
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
