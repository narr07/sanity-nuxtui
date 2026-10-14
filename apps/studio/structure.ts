import type { StructureResolver } from 'sanity/structure'
import { ComposeIcon } from '@sanity/icons/Compose'

export const structure: StructureResolver = S =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.documentTypeListItem('page').title('Pages'),
      S.listItem()
        .id('blog')
        .title('Blog')
        .icon(ComposeIcon)
        .child(
          S.list()
            .id('blog-items')
            .title('Blog')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('author').title('Authors')
            ])
        ),
      S.documentTypeListItem('gallery').title('Galleries'),
      S.divider(),
      // Singleton registered in sanity.config.ts → document.singletons
      S.listItem().singleton('settings')
    ])
