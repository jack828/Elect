import BaseCollection from '../../lib/base-collection'
import Model from '../model/party'

class PartyCollection extends BaseCollection {
  apiUrl = '/api/parties'

  Model = Model
}

export default PartyCollection
