// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      link: [
        {rel: 'preconnect', href: 'https://fonts.gstatic.com'},
        {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
        {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'},
        {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Palanquin:wght@100;200;300;400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap'},
      ],
      script: [
        {
          src:"https://cdn.splitbee.io/sb.js",
        }
      ]
    }
  }
})
