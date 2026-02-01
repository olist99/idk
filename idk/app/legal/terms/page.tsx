import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'Terms of Service - Snog',
  description: 'Terms of Service for Snog social discovery platform',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen pb-24">
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-display font-bold gradient-text text-center">
            Terms of Service
          </h1>
        </div>
      </header>

      <main className="pt-20 px-6">
        <div className="max-w-4xl mx-auto glass p-8 rounded-2xl">
          <p className="text-sm text-white/60 mb-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/80 mb-4">
              By accessing and using Snog ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Age Requirement</h2>
            <p className="text-white/80 mb-4">
              You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into this agreement</li>
              <li>You will provide accurate age verification when requested</li>
              <li>You will not create an account if you are under 18 years old</li>
            </ul>
            <p className="text-white/80 mb-4">
              We reserve the right to verify your age at any time and may request additional verification documentation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
            <p className="text-white/80 mb-4">
              To use the Service, you must:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your password</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Complete age verification when required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
            <p className="text-white/80 mb-4">
              You agree NOT to use the Service to:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Upload content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
              <li>Impersonate any person or entity</li>
              <li>Upload content containing nudity or sexually explicit material</li>
              <li>Harass, stalk, or harm another user</li>
              <li>Share or distribute other users' private information</li>
              <li>Engage in any form of spam or unauthorized advertising</li>
              <li>Upload viruses or malicious code</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use the Service for any commercial purpose without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Content Moderation</h2>
            <p className="text-white/80 mb-4">
              All content uploaded to the Service is subject to moderation:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Photos are reviewed before appearing on your profile</li>
              <li>We use automated tools and human moderators to review content</li>
              <li>Content that violates these terms will be removed</li>
              <li>Repeated violations may result in account suspension or termination</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Privacy and Data Protection</h2>
            <p className="text-white/80 mb-4">
              Your use of the Service is also governed by our Privacy Policy. By using the Service, you consent to:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>The collection and use of your data as described in our Privacy Policy</li>
              <li>The processing of your personal data for the purposes of providing the Service</li>
              <li>The storage and transfer of your data as necessary to provide the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Termination</h2>
            <p className="text-white/80 mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Suspend or terminate your account at any time for any reason</li>
              <li>Remove any content that violates these terms</li>
              <li>Report illegal activity to law enforcement</li>
              <li>Ban users who repeatedly violate these terms</li>
            </ul>
            <p className="text-white/80 mb-4">
              You may delete your account at any time through the account settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
            <p className="text-white/80 mb-4">
              The Service and its original content, features, and functionality are owned by Snog and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-white/80 mb-4">
              You retain ownership of content you upload, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and display your content for the purpose of providing the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-white/80 mb-4">
              THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>The Service will be uninterrupted or error-free</li>
              <li>The results obtained from the Service will be accurate or reliable</li>
              <li>Any errors in the Service will be corrected</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
            <p className="text-white/80 mb-4">
              IN NO EVENT SHALL SNOG BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Safety and Meetings</h2>
            <p className="text-white/80 mb-4">
              While we strive to provide a safe platform:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>We cannot guarantee the identity or intentions of other users</li>
              <li>You are responsible for your own safety when meeting in person</li>
              <li>Always meet in public places for first meetings</li>
              <li>Tell friends or family about your plans</li>
              <li>Trust your instincts</li>
              <li>Report suspicious behavior immediately</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Changes to Terms</h2>
            <p className="text-white/80 mb-4">
              We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new Terms of Service on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
            <p className="text-white/80 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">14. Contact Us</h2>
            <p className="text-white/80 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-white/80">
              Email: legal@snog.com<br />
              Address: [Your Business Address]
            </p>
          </section>

          <div className="mt-8 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
            <p className="text-sm text-white/80">
              By clicking "I Accept" during registration, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
