import type { HtmlTagDescriptor } from 'vite';

export interface GtagOptions {
  id: string;
  sendPageView?: boolean;
}

const generateGtagScript = ({ id, sendPageView }: GtagOptions): HtmlTagDescriptor[] => {
  const normalizedSendPageView = sendPageView ?? true;
  const configLine = normalizedSendPageView
    ? `gtag('config', '${id}');`
    : `gtag('config', '${id}', { send_page_view: false });`;

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
        ${configLine}
      `,
      injectTo: 'head'
    },
  ];
};

export default generateGtagScript;
