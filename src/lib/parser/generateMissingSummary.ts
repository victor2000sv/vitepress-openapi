import type { OpenAPIDocument, OperationObject } from '../../types'
import { httpVerbs } from '../../index'

export function generateMissingSummary(spec: OpenAPIDocument): OpenAPIDocument {
  ['paths', 'webhooks'].forEach((operationType: string) => {
    spec[operationType] = spec[operationType] || {}

    for (const operation of Object.keys(spec[operationType])) {
      const operationValue = spec[operationType][operation] as Record<string, OperationObject>

      for (const verb of httpVerbs) {
        const verbOperation = operationValue[verb]
        if (!verbOperation) {
          continue
        }

        if (!verbOperation.summary) {
          verbOperation.summary = `${verb.toUpperCase()} ${operation}`
        }
      }
    }
  })

  return spec
}
