import type { OpenAPIV3 } from '@scalar/openapi-types'
import type { OpenAPIDocument } from '../../types'
import { httpVerbs } from '../../index'

const RE_SLASH = /\//g
const LEADING_SLASH = /^\//

export function generateMissingOperationIds(spec: OpenAPIDocument): OpenAPIDocument {
  ['paths', 'webhooks'].forEach((operationType: string) => {
    spec[operationType] = spec[operationType] || {}

    for (const operation of Object.keys(spec[operationType])) {
      const operationValue = spec[operationType][operation] as Record<string, OpenAPIV3.OperationObject>

      for (const verb of httpVerbs) {
        const verbOperation = operationValue[verb]
        if (!verbOperation) {
          continue
        }

        if (!verbOperation.operationId) {
          verbOperation.operationId = `${verb}-${operation.replace(LEADING_SLASH, '').replace(RE_SLASH, '-')}`
        }
      }
    }
  })

  return spec
}
