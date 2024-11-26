import React from "react";
import Script from "next/script";

const Id = process.env.GOOGLE_AD_SENSE_ID as string;

const GoogleAdsense: React.FC = () => {
    return (
        <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${Id}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
        />
    );
};

export default GoogleAdsense;