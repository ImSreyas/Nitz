import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { MedalIcon, MapIcon, PlaneIcon, GiftIcon } from "../components/Icons";
import { JSX } from "react";

interface FeatureProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const features: FeatureProps[] = [
  {
    icon: <MedalIcon />,
    title: "Accessibility",
    description:
      "Bitz is accessible from anywhere, allowing you to practice coding challenges on the go.",
  },
  {
    icon: <MapIcon />,
    title: "Community",
    description:
      "Join a vibrant community of coders, share knowledge, and collaborate on coding challenges.",
  },
  {
    icon: <PlaneIcon />,
    title: "Scalability",
    description:
      "Our platform scales with your needs, from beginner to advanced coding challenges.",
  },
  {
    icon: <GiftIcon />,
    title: "Gamification",
    description:
      "Earn rewards and badges as you complete challenges and climb the leaderboards.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="howItWorks" className="container text-center py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold ">
        How It{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Works{" "}
        </span>
        Step-by-Step Guide
      </h2>
      <p className="md:w-3/4 mx-auto mt-4 mb-8 text-xl text-muted-foreground">
        Discover how Bitz can help you enhance your coding skills through a
        structured and engaging process.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map(({ icon, title, description }: FeatureProps) => (
          <Card key={title} className="bg-muted/50">
            <CardHeader>
              <CardTitle className="grid gap-4 place-items-center">
                {icon}
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
