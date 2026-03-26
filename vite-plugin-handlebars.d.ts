declare module 'vite-plugin-handlebars' {
  import type { PluginOption } from 'vite'

  interface HandlebarsPluginOptions {
    partialDirectory?: string
    context?: Record<string, unknown> | ((pagePath: string) => Record<string, unknown>)
    reloadOnPartialChange?: boolean
  }

  export default function handlebars(
    options?: HandlebarsPluginOptions
  ): PluginOption
}