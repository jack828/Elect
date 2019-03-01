import BaseModel from '../../../lib/base-model'
import createSchema from '../../../../../server/service/party/schema'

class PartyModel extends BaseModel {
  createSchema() {
    return createSchema()
  }
}

export default PartyModel
