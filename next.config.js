// /** @type {import('next').NextConfig} */
// const nextConfig = {}
//
// module.exports = nextConfig



// added new for pwa

// @ts-check
// const isDev = process.env.NODE_ENV !== "production";
const withPWA = require('@ducanh2912/next-pwa').default({
    dest: 'public',
    sw: 'service-worker.js',
    // importScripts: ['https://js.pusher.com/beams/service-worker.js'],
    // exclude: [
    //     ({ asset, compilation }) => {
    //         if (
    //             asset.name.startsWith("server/") ||
    //             asset.name.match(/^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/)
    //         ) {
    //             return true;
    //         }
    //         return isDev && !asset.name.startsWith("static/runtime/");
    //
    //     }
    // ],
})

module.exports = withPWA({
    // next.js config
    // experimental: {
    //     appDir: true
    // }
})
