import BaseModel from '../../../lib/base-model'
import createSchema from '../../../../../server/services/party/schema'

class PartyModel extends BaseModel {
  createSchema() {
    return createSchema()
  }
}

export default PartyModel
