import type { StructureBuilder, StructureResolver } from 'sanity/structure'
import type { SanityClient } from 'sanity'
import { CogIcon } from '@sanity/icons/Cog'
import { DocumentsIcon } from '@sanity/icons/Documents'
import { FolderIcon } from '@sanity/icons/Folder'
import { SETTINGS_TRANSLATION_PREFIX } from './schemaTypes/documents/settings'
import { API_VERSION, getLanguages } from './schemaTypes/shared/language'

// One language: the settings document. Several: the main settings plus a copy
// per extra language ("settings-<language>") for translated menus and text.
async function settingsChild(S: StructureBuilder, client: SanityClient) {
  const [main, ...others] = await getLanguages(client)
  const mainSettings = S.document().schemaType('settings').documentId('settings')
  if (!others.length) return mainSettings
  return S.list()
    .id('settings-languages')
    .title('Site Settings')
    .items([
      S.listItem().id('settings').title(`Main settings (${main?.title})`).icon(CogIcon).child(mainSettings),
      S.divider(),
      ...others.map(language => S.listItem()
        .id(`${SETTINGS_TRANSLATION_PREFIX}${language.id}`)
        .title(language.title)
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId(`${SETTINGS_TRANSLATION_PREFIX}${language.id}`)))
    ])
}

export const structure: StructureResolver = (S, { getClient }) =>
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
      S.listItem()
        .id('settings')
        .title('Site Settings')
        .icon(CogIcon)
        .child(() => settingsChild(S, getClient({ apiVersion: API_VERSION })))
    ])
