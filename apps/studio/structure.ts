import type { StructureResolver } from 'sanity/structure'
import { DocumentsIcon } from '@sanity/icons/Documents'
import { FolderIcon } from '@sanity/icons/Folder'

export const structure: StructureResolver = S =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      S.documentTypeListItem('page').title('Pages'),

      // Collections → pick one → its entries. New entries created here are
      // assigned to that collection automatically (see the "entry-in-collection"
      // template in sanity.config.ts).
      S.listItem()
        .id('collections')
        .title('Collections')
        .icon(FolderIcon)
        .child(
          S.documentTypeList('collection')
            .title('Collections')
            .child(collectionId =>
              S.list()
                .id(`collection-${collectionId}`)
                .title('Collection')
                .items([
                  S.listItem()
                    .id('entries')
                    .title('Entries')
                    .icon(DocumentsIcon)
                    .child(
                      S.documentList()
                        .id(`entries-${collectionId}`)
                        .title('Entries')
                        .schemaType('entry')
                        .apiVersion('2026-10-01')
                        .filter('_type == "entry" && collection._ref == $collectionId')
                        .params({ collectionId })
                        .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                        .initialValueTemplates([
                          S.initialValueTemplateItem('entry-in-collection', { collectionId })
                        ])
                    ),
                  S.listItem()
                    .id('settings')
                    .title('Collection settings')
                    .icon(FolderIcon)
                    .child(S.document().schemaType('collection').documentId(collectionId))
                ])
            )
        ),

      S.documentTypeListItem('entry').title('All entries').icon(DocumentsIcon),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      // Singleton registered in sanity.config.ts → document.singletons
      S.listItem().singleton('settings')
    ])
