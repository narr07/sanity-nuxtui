import { defineField } from 'sanity'

// Languages offered in the code editor. `value` is what the site uses for syntax
// highlighting (Shiki); `mode` is the editor mode inside the Studio.
export const CODE_LANGUAGES = [
  { title: 'TypeScript', value: 'typescript' },
  { title: 'JavaScript', value: 'javascript' },
  { title: 'Vue', value: 'vue', mode: 'html' },
  { title: 'HTML', value: 'html' },
  { title: 'CSS', value: 'css' },
  { title: 'SCSS', value: 'scss' },
  { title: 'JSON', value: 'json' },
  { title: 'Shell', value: 'sh' },
  { title: 'YAML', value: 'yaml' },
  { title: 'Markdown', value: 'markdown' },
  { title: 'GROQ', value: 'groq' },
  { title: 'SQL', value: 'sql' },
  { title: 'Python', value: 'python' },
  { title: 'PHP', value: 'php' },
  { title: 'Plain text', value: 'text' }
]

export const codeOptions = {
  language: 'typescript',
  languageAlternatives: CODE_LANGUAGES,
  withFilename: true
}

// A single code block: the "code" type from @sanity/code-input, with a file name
export function codeField(name = 'code', title = 'Code') {
  return defineField({ name, title, type: 'code', options: codeOptions })
}
