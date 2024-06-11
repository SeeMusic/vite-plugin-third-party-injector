import type { HtmlTagDescriptor } from 'vite';

const generateGtagScript = (id: string): HtmlTagDescriptor[] => {
  return [
    {
      tag: 'script',
      attrs: {
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${id}`
      },
      injectTo: 'head'
    },
    {
      tag: 'script',
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', '${id}');
      `,
      injectTo: 'head'
    },
  ]
}

export default generateGtagScript;
