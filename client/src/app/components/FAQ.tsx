import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is Bitz free to use?",
    answer:
      "Yes, Bitz offers a free plan with access to basic coding challenges and community support.",
    value: "item-1",
  },
  {
    question: "What types of coding challenges are available?",
    answer:
      "Bitz offers a wide range of coding challenges, from beginner to advanced levels, across various topics and languages.",
    value: "item-2",
  },
  {
    question: "How can I track my progress?",
    answer:
      "You can track your progress through real-time leaderboards and detailed analytics available on your dashboard.",
    value: "item-3",
  },
  {
    question: "Can I collaborate with other programmers?",
    answer:
      "Yes, Bitz allows you to collaborate with other programmers on coding challenges and projects in real-time.",
    value: "item-4",
  },
  {
    question: "What support options are available?",
    answer:
      "Bitz offers community support for free users and priority support for premium users.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="container py-24 sm:py-32">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Frequently Asked{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Questions
        </span>
      </h2>

      <Accordion type="single" collapsible className="w-full AccordionRoot">
        {FAQList.map(({ question, answer, value }: FAQProps) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <h3 className="font-medium mt-4">
        Still have questions?{" "}
        <a
          rel="noreferrer noopener"
          href="#"
          className="text-primary transition-all border-primary hover:border-b-2"
        >
          Contact us
        </a>
      </h3>
    </section>
  );
};
