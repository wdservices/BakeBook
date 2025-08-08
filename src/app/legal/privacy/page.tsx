import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-[hsl(var(--blue))]">BakeBook Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Effective Date: August 8, 2025</p>
        
        <div className="space-y-6">
          <Section title="1. Introduction">
            BakeBook ("we," "our," "us") values your privacy. This Privacy Policy explains how we collect, 
            use, store, and protect your personal information when you use our app.
          </Section>

          <Section title="2. Information We Collect">
            We may collect the following information:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Personal details (name, email, phone number)</li>
              <li>Order information (customer names, delivery addresses, order details)</li>
              <li>Recipes, images, and files you upload</li>
              <li>Device and usage information</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            We use your data to:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide and improve BakeBook services</li>
              <li>Manage and track your orders</li>
              <li>Store your recipes and baking-related data</li>
              <li>Send notifications and reminders</li>
              <li>Communicate with you about updates or issues</li>
            </ul>
          </Section>

          <Section title="4. Data Storage and Security">
            We store your data securely and implement measures to protect it from unauthorized access. 
            However, no method of transmission over the internet is 100% secure.
          </Section>

          <Section title="5. Sharing of Information">
            We do not sell or rent your personal data. We may share it with trusted third-party service 
            providers for app functionality, analytics, or legal obligations.
          </Section>

          <Section title="6. Your Rights">
            You can:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access and update your personal information</li>
              <li>Request data deletion</li>
              <li>Opt out of notifications</li>
            </ul>
          </Section>

          <Section title="7. Changes to This Policy">
            We may update this policy from time to time. The updated version will be posted in the app with a 
            revised effective date.
          </Section>

          <Section title="8. Contact Us">
            If you have any questions about this policy, contact us at:{' '}
            <a href="mailto:hello.wdservices@gmail.com" className="text-orange-500 hover:underline">
              hello.wdservices@gmail.com
            </a>
          </Section>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-2 text-[hsl(var(--blue))]">{title}</h2>
      <div className="text-orange-500">{children}</div>
    </section>
  );
}
