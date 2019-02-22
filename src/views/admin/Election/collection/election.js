import BaseCollection from '../../../lib/base-collection'
import Model from '../model/election'

class ElectionCollection extends BaseCollection {
  apiUrl = '/api/elections'

  Model = Model
}

export default ElectionCollection
