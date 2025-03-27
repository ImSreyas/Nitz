import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TestimonialProps {
  image: string;
  name: string;
  userName: string;
  comment: string;
}

const testimonials: TestimonialProps[] = [
  {
    image: "https://github.com/shadcn.png",
    name: "Jane Smith",
    userName: "@jane_smith",
    comment:
      "Bitz has significantly improved my coding skills. The challenges are top-notch!",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "John Doe",
    userName: "@john_doe",
    comment:
      "The real-time leaderboards keep me motivated to improve and compete.",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Alice Johnson",
    userName: "@alice_johnson",
    comment:
      "I love the community aspect of Bitz. It's great to collaborate with other coders.",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Bob Brown",
    userName: "@bob_brown",
    comment:
      "The AI-powered insights have helped me identify and work on my weak areas.",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Charlie Davis",
    userName: "@charlie_davis",
    comment:
      "Bitz offers a wide range of coding challenges that keep me engaged and learning.",
  },
  {
    image: "https://github.com/shadcn.png",
    name: "Dana Lee",
    userName: "@dana_lee",
    comment:
      "The platform is user-friendly and the challenges are well-structured.",
  },
];

export const Testimonials = () => {
  return (
    <section id="testimonials" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold">
        Discover Why
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          People Love{" "}
        </span>
        Bitz
      </h2>

      <p className="text-xl text-muted-foreground pt-4 pb-8">
        See what our users have to say about their experience with Bitz.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 sm:block columns-2 lg:columns-3 lg:gap-6 mx-auto space-y-4 lg:space-y-6">
        {testimonials.map(
          ({ image, name, userName, comment }: TestimonialProps) => (
            <Card
              key={userName}
              className="max-w-md md:break-inside-avoid overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar>
                  <AvatarImage alt="" src={image} />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <CardTitle className="text-lg">{name}</CardTitle>
                  <CardDescription>{userName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent>{comment}</CardContent>
            </Card>
          )
        )}
      </div>
    </section>
  );
};
