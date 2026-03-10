// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { remarkHeadingId } from 'remark-custom-heading-id';
import remarkMath from 'remark-math';
import rehypeMathJax from 'rehype-mathjax';
import starlightImageZoom from 'starlight-image-zoom'

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.b-cubed-eu',
  integrations: [
    starlight({
      title: 'B-Cubed documentation',
      logo: {
        src: './src/assets/b3-logo.svg',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/b-cubed-eu/documentation/'
        }
      ],
      sidebar: [
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Software',
          autogenerate: { directory: 'software' },
          collapsed: true,
        },
        {
          label: 'Infrastructure',
          autogenerate: { directory: 'infrastructure' },
          collapsed: true,
        },
        {
          label: 'Tutorials',
          autogenerate: { directory: 'tutorials' },
          collapsed: true,
        }
      ],
      components: {
        PageTitle: './src/components/PageTitle.astro',
      },
      customCss: [
        './src/styles/custom.css',
      ],
      head: [
        {
          tag: 'script',
          attrs: {
            src: '/js/matomo.js',
          }
        }
      ],
      editLink: {
        baseUrl: 'https://github.com/b-cubed-eu/documentation/edit/main/',
      },
      plugins: [
        starlightImageZoom()
      ],
    }),
  ],
  redirects: {
    '/dev-guide/': '/guides/software-development/',
    '/occurrence-cube/specification/': '/guides/occurrence-cube/'
  },
  markdown: {
    gfm: true,
    remarkPlugins: [
      remarkHeadingId,
      remarkMath
    ],
    rehypePlugins: [
      rehypeMathJax
    ]
  }
});
