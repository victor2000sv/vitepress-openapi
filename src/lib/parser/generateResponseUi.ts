import type { ParsedContent, ParsedOpenAPI, ParsedOperation } from '../../types'
import { httpVerbs } from '../../index'
import { getSchemaExample } from '../examples/getSchemaExample'
import { getSchemaUi } from './getSchemaUi'

export function generateResponseUi(spec: ParsedOpenAPI): ParsedOpenAPI {
  if (spec.paths) {
    processPathItems(spec.paths)
  }

  if (spec.webhooks) {
    processPathItems(spec.webhooks)
  }

  return spec
}

function processPathItems(pathItems: Record<string, any>): void {
  for (const path of Object.values(pathItems)) {
    if (!path) {
      continue
    }
    for (const verb of httpVerbs) {
      const operation = (path as Record<string, any>)[verb] as ParsedOperation

      if (!operation || !operation.responses) {
        continue
      }

      for (const response of Object.values(operation.responses)) {
        for (const [contentType, content] of Object.entries(response.content || {})) {
          const parsedContent = content as ParsedContent

          if (!parsedContent.schema) {
            continue
          }

          parsedContent.ui = getSchemaUi(parsedContent.schema)
          parsedContent.examples = {
            ...(parsedContent.examples || {}),
            ...getSchemaExample(contentType, parsedContent.ui, true),
          }
        }
      }
    }
  }
}
