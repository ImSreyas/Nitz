import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import image from "../assets/growth.png";
import image3 from "../assets/reflecting.png";
import image4 from "../assets/looking-ahead.png";
import Image, { StaticImageData } from "next/image";

interface FeatureProps {
  title: string;
  description: string;
  image: StaticImageData;
}

const features: FeatureProps[] = [
  {
    title: "Challenging Problems",
    description:
      "Tackle a wide range of coding problems that test your skills and help you grow.",
    image: image4,
  },
  {
    title: "Real-Time Leaderboards",
    description:
      "Compete with programmers worldwide and see your ranking in real-time.",
    image: image3,
  },
  {
    title: "AI-Powered Insights",
    description:
      "Leverage AI to gain insights and improve your coding skills efficiently.",
    image: image,
  },
];

const featureList: string[] = [
  "Dark/Light Theme",
  "Code Reviews",
  "Advanced Features",
  "Flexible Pricing",
  "Contact Support",
  "Our Team",
  "Responsive Design",
  "Newsletter",
  "Minimalist Design",
];

export const Features = () => {
  return (
    <section id="features" className="container py-24 sm:py-32 space-y-8">
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Many{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Great Features
        </span>
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <Image
                height={100}
                width={300}
                src={image}
                alt="About feature"
                className="w-[200px] lg:w-[300px] mx-auto"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
