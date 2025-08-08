import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 text-[hsl(var(--blue))]">BakeBook - Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last Updated: August 8, 2025</p>
        
        <p className="mb-6">
          Welcome to BakeBook! These Terms of Service ("Terms") govern your use of the BakeBook 
          application, website, and related services (collectively, the "Service") provided by BakeBook. 
          By accessing or using BakeBook, you agree to comply with and be bound by these Terms.
        </p>

        <div className="space-y-6">
          <Section title="1. Eligibility">
            You must be at least 13 years old to use BakeBook. If you are under the legal age of majority in your 
            jurisdiction, you may only use BakeBook under the supervision of a parent or legal guardian.
          </Section>

          <Section title="2. Account Registration">
            To use certain features, you may be required to create an account. You agree to provide accurate, current, 
            and complete information during registration and to keep your information updated.
          </Section>

          <Section title="3. Use of the Service">
            You agree to use BakeBook only for lawful purposes and in accordance with these Terms. You are responsible 
            for your activities on the Service, including any content you create, store, or share.
          </Section>

          <Section title="4. User Content">
            You retain ownership of any recipes, media, or other content you upload to BakeBook ("User Content"). 
            By uploading User Content, you grant BakeBook a worldwide, non-exclusive, royalty-free license to use, 
            store, and display it for the purpose of operating and improving the Service.
          </Section>

          <Section title="5. Prohibited Activities">
            You agree not to:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service for illegal or unauthorized purposes.</li>
              <li>Interfere with the security or functionality of BakeBook.</li>
              <li>Upload malicious code or content.</li>
              <li>Harass, abuse, or harm other users.</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            BakeBook and its content, features, and functionality are owned by BakeBook and protected by copyright, 
            trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of the 
            Service without prior written consent.
          </Section>

          <Section title="7. Termination">
            We may suspend or terminate your access to BakeBook at any time, without prior notice, for conduct that 
            violates these Terms or is harmful to other users or the Service.
          </Section>

          <Section title="8. Disclaimers">
            BakeBook is provided on an 'as is' and 'as available' basis. We make no warranties, expressed or implied, 
            regarding the Service's operation, accuracy, or reliability.
          </Section>

          <Section title="9. Limitation of Liability">
            To the fullest extent permitted by law, BakeBook shall not be liable for any indirect, incidental, special, 
            or consequential damages arising from your use of the Service.
          </Section>

          <Section title="10. Changes to These Terms">
            We may update these Terms from time to time. Any changes will be posted within the app or on our website, 
            and your continued use of BakeBook constitutes acceptance of the updated Terms.
          </Section>

          <Section title="11. Contact Information">
            If you have any questions about these Terms, please contact us at: 
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
