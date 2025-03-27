import { Button } from "./ui/button";

export const Cta = () => {
  return (
    <section id="cta" className="bg-muted/50 py-16 my-24 sm:my-32 px-16 rounded-md">
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
        <div className="lg:col-start-1">
          <h2 className="text-3xl md:text-4xl font-bold ">
            Enhance Your
            <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
              {" "}
              Coding Skills{" "}
            </span>
            With Bitz
          </h2>
          <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
            Join Bitz today and start solving challenging problems, competing
            with programmers worldwide, and improving your coding skills.
          </p>
        </div>

        <div className="space-y-4 lg:col-start-2">
          <Button className="w-full md:mr-4 md:w-auto">Get Started</Button>
          <Button variant="outline" className="w-full md:w-auto">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};
