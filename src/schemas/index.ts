
import type {SchemaTypeDefinition} from 'sanity'

import clientType from './clientSchema'
import brandKitType from './brandKitSchema'
import assetType from './assetSchema'
import assetVersionType from './assetVersionSchema'

export const schemaTypes: SchemaTypeDefinition[] = [
  clientType,
  brandKitType,
  assetType,
  assetVersionType,
]
