// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { remarkHeadingId } from 'remark-custom-heading-id';

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.b-cubed-eu',
  integrations: [
    starlight({
      title: 'B-Cubed documentation',
      social: {
        github: 'https://github.com/b-cubed-eu/documentation/',
      },
      sidebar: [
        {
          label: 'Guides',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Example Guide', slug: 'guides/example' },
          ],
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' },
        },
      ],
    }),
  ],
  markdown: {
    remarkPlugins: [remarkHeadingId]
  }
});
