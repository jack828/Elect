import BaseCollection from '../../lib/base-collection'
import Model from '../model/administrator'

class AdministratorCollection extends BaseCollection {
  apiUrl = '/api/administrators'

  Model = Model
}

export default AdministratorCollection
