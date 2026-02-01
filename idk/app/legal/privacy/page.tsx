import Navigation from '@/components/Navigation';

export const metadata = {
  title: 'Privacy Policy - Snog',
  description: 'Privacy Policy for Snog social discovery platform',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pb-24">
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-display font-bold gradient-text text-center">
            Privacy Policy
          </h1>
        </div>
      </header>

      <main className="pt-20 px-6">
        <div className="max-w-4xl mx-auto glass p-8 rounded-2xl">
          <p className="text-sm text-white/60 mb-8">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-white/80 mb-4">
              Snog ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. This policy complies with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">2.1 Information You Provide</h3>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, date of birth, gender, location</li>
              <li><strong>Profile Information:</strong> Photos, bio, interests, preferences</li>
              <li><strong>Age Verification:</strong> Government ID or other age verification documents</li>
              <li><strong>Communications:</strong> Messages, reports, customer support inquiries</li>
              <li><strong>Payment Information:</strong> Processed securely by third-party payment providers</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Information Collected Automatically</h3>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li><strong>Usage Data:</strong> How you interact with the Service, features used, time spent</li>
              <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
              <li><strong>Log Data:</strong> IP address (anonymized), access times, pages viewed</li>
              <li><strong>Location Data:</strong> Approximate location based on IP address</li>
              <li><strong>Cookies:</strong> See our Cookie Policy for details</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-white/80 mb-4">We use your information to:</p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Provide and maintain the Service</li>
              <li>Verify your identity and age</li>
              <li>Match you with other users based on preferences</li>
              <li>Enable communication between users</li>
              <li>Detect and prevent fraud, abuse, and security incidents</li>
              <li>Moderate content for safety and compliance</li>
              <li>Improve and personalize your experience</li>
              <li>Send you updates and notifications (with your consent)</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce our Terms of Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Legal Basis for Processing (GDPR)</h2>
            <p className="text-white/80 mb-4">We process your data based on:</p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li><strong>Consent:</strong> You have given explicit consent for specific purposes</li>
              <li><strong>Contract:</strong> Processing is necessary to fulfill our contract with you</li>
              <li><strong>Legal Obligation:</strong> We must process data to comply with the law</li>
              <li><strong>Legitimate Interests:</strong> Processing is necessary for our legitimate business interests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Data Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-semibold mb-3 mt-6">5.1 With Other Users</h3>
            <p className="text-white/80 mb-4">
              Your profile information, photos, and bio are visible to other users of the Service.
            </p>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.2 With Service Providers</h3>
            <p className="text-white/80 mb-4">We share data with trusted third parties who help us operate the Service:</p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Cloud hosting providers</li>
              <li>Payment processors</li>
              <li>Age verification services</li>
              <li>Content moderation services</li>
              <li>Analytics providers</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-6">5.3 For Legal Reasons</h3>
            <p className="text-white/80 mb-4">We may disclose your information:</p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>To comply with legal obligations</li>
              <li>To protect our rights and property</li>
              <li>To prevent fraud or security issues</li>
              <li>To protect the safety of users</li>
              <li>In response to valid legal requests from authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Your Rights (GDPR)</h2>
            <p className="text-white/80 mb-4">Under GDPR, you have the right to:</p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              <li><strong>Lodge a Complaint:</strong> Contact your data protection authority</li>
            </ul>
            <p className="text-white/80 mb-4">
              To exercise these rights, visit your account settings or contact us at privacy@snog.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
            <p className="text-white/80 mb-4">
              We retain your data for as long as necessary to provide the Service and comply with legal obligations:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li><strong>Account Data:</strong> Until you delete your account</li>
              <li><strong>Messages:</strong> Until deleted by you or after 1 year of inactivity</li>
              <li><strong>Age Verification:</strong> Retained for compliance purposes</li>
              <li><strong>Audit Logs:</strong> Retained for 1 year for security purposes</li>
            </ul>
            <p className="text-white/80 mb-4">
              When you delete your account, we will delete or anonymize your data within 30 days, except where we must retain it for legal reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Data Security</h2>
            <p className="text-white/80 mb-4">We implement strong security measures to protect your data:</p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>End-to-end encryption for sensitive data</li>
              <li>Secure HTTPS connections</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and authentication</li>
              <li>Data backup and disaster recovery</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Age Verification and Child Protection</h2>
            <p className="text-white/80 mb-4">
              Our Service is strictly for users 18 years and older. We:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Require age verification during registration</li>
              <li>Do not knowingly collect data from minors</li>
              <li>Immediately delete accounts of users under 18</li>
              <li>Report suspected child exploitation to authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. International Data Transfers</h2>
            <p className="text-white/80 mb-4">
              Your data may be transferred to and processed in countries other than your own. We ensure adequate protection through:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Standard Contractual Clauses approved by the EU Commission</li>
              <li>Adequacy decisions</li>
              <li>Your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">11. Cookies and Tracking</h2>
            <p className="text-white/80 mb-4">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Keep you signed in</li>
              <li>Remember your preferences</li>
              <li>Understand how you use the Service</li>
              <li>Improve performance and security</li>
            </ul>
            <p className="text-white/80 mb-4">
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">12. Changes to This Policy</h2>
            <p className="text-white/80 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by:
            </p>
            <ul className="list-disc list-inside text-white/80 mb-4 space-y-2">
              <li>Posting the new policy on this page</li>
              <li>Updating the "Last Updated" date</li>
              <li>Sending you an email notification (for significant changes)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
            <p className="text-white/80 mb-4">
              For questions about this Privacy Policy or to exercise your rights:
            </p>
            <p className="text-white/80 mb-4">
              <strong>Data Protection Officer</strong><br />
              Email: privacy@snog.com<br />
              Address: [Your Business Address]
            </p>
            <p className="text-white/80">
              <strong>EU Representative</strong> (if applicable)<br />
              [EU Representative Details]
            </p>
          </section>

          <div className="mt-8 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
            <p className="text-sm text-white/80">
              <strong>Your Rights Matter:</strong> You have control over your data. Contact us anytime to access, correct, or delete your information.
            </p>
          </div>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
