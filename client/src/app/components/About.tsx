import { Statistics } from "./Statistics";
import pilot from "../assets/pilot.png";
import Image from "next/image";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="bg-muted/50 border rounded-lg py-12">
        <div className="px-6 flex flex-col-reverse md:flex-row gap-8 md:gap-12">
          <Image
            height={100}
            width={300}
            src={pilot}
            alt="Pilot"
            className="w-[300px] object-contain rounded-lg"
          />
          <div className="bg-green-0 flex flex-col justify-between">
            <div className="pb-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  About{" "}
                </span>
                Bitz
              </h2>
              <p className="text-xl text-muted-foreground mt-4">
                Bitz is a cutting-edge competitive coding platform designed to
                help programmers enhance their skills through challenging
                problems. Our platform offers a wide range of coding challenges,
                real-time leaderboards, and a vibrant community of coders from
                around the world.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
