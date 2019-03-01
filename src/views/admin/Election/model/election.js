import BaseModel from '../../../lib/base-model'
import createSchema from '../../../../../server/service/election/schema'

class ElectionModel extends BaseModel {
  createSchema() {
    return createSchema()
  }
}

export default ElectionModel
