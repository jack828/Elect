import schemata from 'schemata'
import omit from 'lodash.omit'
import BaseModel from '../../../lib/base-model'
import createSchema from '../../../../../server/services/administrator/schema'

class AdministratorModel extends BaseModel {
  createSchema() {
    return schemata({
      name: 'Administrator',
      properties:
        omit(
          createSchema(
            null,
          ).getProperties(),
          'password',
          'passwordSalt',
          'key',
          'keyExpiry'
        )
    })
  }
}

export default AdministratorModel
