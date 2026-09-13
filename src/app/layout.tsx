import './styles/globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import ReactQueryProvider from '../../components/ReactQueryProvider';
import { CartProvider } from '../../lib/cart';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { AuthProvider } from '../../lib/AuthContext';
import Script from 'next/script';
import { ThemeProvider } from '../../components/ThemeProvider';
import Loader from '../../components/Loader';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const SITE_DESCRIPTION =
  'Handcrafted leather footwear — hand-welted and Goodyear-welted oxfords, loafers, monk straps, boots and sandals. Delivered across India.';

export const metadata: Metadata = {
  metadataBase: new URL('https://tap2buy.in'),
  title: {
    default: 'Tap2Buy — Handcrafted Leather Footwear',
    template: '%s | Tap2Buy',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'handmade leather shoes',
    'hand welted shoes india',
    'goodyear welted shoes',
    'leather oxfords',
    'leather loafers',
    'chelsea boots india',
    'monk strap shoes',
    'leather sandals',
    'tap2buy',
  ],
  openGraph: {
    title: 'Tap2Buy — Handcrafted Leather Footwear',
    description: SITE_DESCRIPTION,
    url: 'https://tap2buy.in',
    siteName: 'Tap2Buy',
    images: [{ url: '/logo.jpg', alt: 'Tap2Buy' }],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tap2Buy — Handcrafted Leather Footwear',
    description: SITE_DESCRIPTION,
    images: ['/logo.jpg'],
    creator: '@tap2buyin',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://tap2buy.in' },
  category: 'ecommerce',
  formatDetection: { email: false, address: false, telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtagId = 'AW-XXXXXXXXX';

  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1A1410" />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Tap2Buy',
              description: SITE_DESCRIPTION,
              url: 'https://tap2buy.in',
              logo: 'https://tap2buy.in/logo.jpg',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Delhi',
                addressRegion: 'Delhi',
                addressCountry: 'IN',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+91-9911636888',
                contactType: 'customer service',
                email: 'support@tap2buy.in',
                availableLanguage: ['English', 'Hindi'],
              },
              sameAs: [
                'https://www.facebook.com/tap2buyin',
                'https://www.instagram.com/tap2buyin',
                'https://www.youtube.com/@tap2buyin',
              ],
            }),
          }}
        />

        {/* WebSite + Sitelinks Searchbox Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Tap2Buy',
              url: 'https://tap2buy.in',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://tap2buy.in/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />

        {/* Microsoft Clarity */}
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "upgau66qzf");
            `,
          }}
        />

        {/* Meta Pixel */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1944720636112584');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1944720636112584&ev=PageView&noscript=1"
            alt="facebook pixel"
          />
        </noscript>

        {/* Google Analytics */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtagId}', { page_title: 'Tap2Buy', page_location: window.location.href });
          `}
        </Script>

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX');
          `}
        </Script>
      </head>

      <body className="overflow-x-hidden bg-ivory font-sans text-espresso antialiased">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        <Loader />

        <ThemeProvider>
          <ReactQueryProvider>
            <CartProvider>
              <AuthProvider>
                <Header />
                <main role="main" className="min-h-screen">
                  {children}
                </main>
                <Footer />
              </AuthProvider>
            </CartProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
