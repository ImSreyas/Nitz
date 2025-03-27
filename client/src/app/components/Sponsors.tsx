import { Star, Code, Award, Rocket, Shield, Globe } from "lucide-react";
import { JSX } from "react";

interface SponsorProps {
  icon: JSX.Element;
  name: string;
}

const sponsors: SponsorProps[] = [
  {
    icon: <Star size={34} />,
    name: "Tech Innovators",
  },
  {
    icon: <Code size={34} />,
    name: "Code Masters",
  },
  {
    icon: <Award size={34} />,
    name: "Dev Gurus",
  },
  {
    icon: <Rocket size={34} />,
    name: "Algo Experts",
  },
  {
    icon: <Shield size={34} />,
    name: "Hackathon Heroes",
  },
  {
    icon: <Globe size={34} />,
    name: "Startup Pioneers",
  },
];

export const Sponsors = () => {
  return (
    <section id="sponsors" className="container pt-24 sm:py-32">
      <h2 className="text-center text-md lg:text-xl font-bold mb-8 text-primary">
        Our Esteemed Sponsors
      </h2>

      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
        {sponsors.map(({ icon, name }: SponsorProps) => (
          <div
            key={name}
            className="flex items-center gap-1 text-muted-foreground/60"
          >
            <span>{icon}</span>
            <h3 className="text-xl font-bold">{name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};
