export default defineNuxtPlugin(() => {
    if (process.client) {
        const loadGtag = () => {
            //console.log('准备加载 gtag.js');
            const script = document.createElement('script');
            script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7WWRDRTRYJ'; // TODO: 替换为你的GA_ID
            script.async = true;
            document.head.appendChild(script);

            // @ts-ignore
            window.dataLayer = window.dataLayer || [];
            function gtag() {
                // @ts-ignore
                window.dataLayer.push(arguments);
            }
            // @ts-ignore
            window.gtag = gtag;
            // @ts-ignore
            window.gtag('js', new Date());
            // @ts-ignore
            window.gtag('config', 'G-7WWRDRTRYJ'); // TODO: 替换为你的GA_ID
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadGtag, { timeout: 3000 });
        } else {
            setTimeout(loadGtag, 2000);
        }
    }
});
