import React from "react";

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>

      <div className="space-y-6">
        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">How can I contact support?</h3>
              <p className="text-sm text-muted-foreground">
                You can reach out to us via email at{" "}
                <a
                  href="mailto:support@blits.com"
                  className="text-primary underline"
                >
                  support@blits.com
                </a>
                .
              </p>
            </div>
            <div>
              <h3 className="font-medium">Where can I find the user guide?</h3>
              <p className="text-sm text-muted-foreground">
                The user guide is available in the &quot;Documentation&quot; section of
                the website.
              </p>
            </div>
          </div>
        </section>
        
      </div>
    </div>
  );
}
