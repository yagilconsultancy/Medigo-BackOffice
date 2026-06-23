import Script from 'next/script';

export const Header = () => {
  return (
    <head>
      {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" /> */}
      <link rel="icon" href="/favicon.svg" sizes="any" />
      <Script
        src="https://cdn.3guideai.com/sdk/guideai.js"
        data-site-id="5922b17f-d24e-4a74-aa89-a33832c22247"
        data-token="pk_live_QGIfFSNUNTJPbXJWYTUkAOZueAb-ZSnbv00bY6rkylw"
        data-track-all="true"
        data-behavioral-triggers="true"
        data-bubble-label="Explore MediGo"
        // data-bubble-image="/logo.svg"
        data-bubble-mode="hybrid"
        data-theme-primary="#2F6FED"
        data-theme-background="#111827"
        data-theme-text="#ffffff"
        data-bubble-background="#3B82F62E"
        data-bubble-text-color="#3B82F680"
        data-bubble-background-hover="#3B82F62E"
        data-bubble-border="#2F6FED"
        data-bubble-border-hover="#2F6FED"
        data-theme-font="Inter, sans-serif"
      ></Script>
    </head>
  );
};
