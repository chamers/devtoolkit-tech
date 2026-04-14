const PrivacyPage = () => {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <div className="rounded-2xl border border-border/60 bg-background/80 p-8 shadow-sm backdrop-blur">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated: April 2026
        </p>

        <div
          className="prose prose-neutral dark:prose-invert mt-8 max-w-none
  prose-h2:text-lg
  prose-h2:font-semibold
  prose-h2:mt-6
  prose-h2:mb-2"
        >
          <p>
            This Privacy Policy explains how DevToolkit collects, uses, and
            protects information when you use this website.
          </p>

          <h2>1. Information collected</h2>
          <p>DevToolkit may collect limited information such as:</p>
          <ul>
            <li>account details you provide when signing up or signing in</li>
            <li>information submitted through forms or resource submissions</li>
            <li>basic usage or analytics data to improve the platform</li>
          </ul>

          <h2>2. How information is used</h2>
          <p>Your information may be used to:</p>
          <ul>
            <li>provide and maintain the website</li>
            <li>support sign-in and account-related functionality</li>
            <li>review or manage submitted resources and content</li>
            <li>improve the quality, usability, and security of DevToolkit</li>
          </ul>

          <h2>3. Cookies and analytics</h2>
          <p>
            DevToolkit may use cookies or similar technologies for essential
            site functionality, preferences, and analytics. You can control
            cookies through your browser settings.
          </p>

          <h2>4. Third-party providers</h2>
          <p>
            DevToolkit may rely on third-party services for hosting,
            authentication, analytics, databases, or other technical
            functionality. These providers may process data as necessary to
            deliver their services.
          </p>

          <h2>5. Third-party links</h2>
          <p>
            This website contains links to external websites and developer
            tools. DevToolkit is not responsible for the privacy practices or
            content of those third-party sites.
          </p>

          <h2>6. Data retention</h2>
          <p>
            Information is retained only as long as reasonably necessary for the
            operation of the platform, security, legal obligations, or
            legitimate business purposes.
          </p>

          <h2>7. Data security</h2>
          <p>
            Reasonable steps are taken to protect information, but no online
            platform can guarantee absolute security.
          </p>

          <h2>8. Your rights</h2>
          <p>
            Depending on your location, you may have rights to request access,
            correction, or deletion of your personal data. A contact method can
            be added here for such requests.
          </p>

          <h2>9. Changes to this policy</h2>
          <p>
            This Privacy Policy may be updated from time to time. The latest
            version will always be posted on this page.
          </p>

          <h2>10. Contact</h2>
          <p>
            If you have privacy-related questions, you can add your contact
            email here once available.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPage;
