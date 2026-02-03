'use client';



import { useEffect } from 'react';



interface PageTrackerProps {

    salespersonId: string;

    slug: string;

}



export default function PageTracker({ salespersonId, slug }: PageTrackerProps) {

    useEffect(() => {

        const trackScan = async () => {

            let location = null;



            // Try to get geolocation if permitted

            if ("geolocation" in navigator) {

                try {

                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {

                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });

                    });

                    location = {

                        lat: position.coords.latitude,

                        lng: position.coords.longitude,

                        accuracy: position.coords.accuracy

                    };

} catch {

                }

            }



            fetch('/api/track', {

                method: 'POST',

                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({

                    salespersonId,

                    slug,

                    timestamp: new Date().toISOString(),

                    location,

                    referrer: document.referrer,

                    userAgent: navigator.userAgent,

                    path: window.location.pathname

                }),

            }).catch(() => {});

        };



        trackScan();

    }, [salespersonId, slug]);



    return null;

}

