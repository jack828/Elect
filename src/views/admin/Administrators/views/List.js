import React from 'react'
import BaseListView from '../../../lib/base-list-view'
import FilterView from './ListFilter'
import ListItemHeaderView from './ListItemHeaderView'
import ListItemView from './ListItemView'
import Collection from '../collection/administrator'

class List extends BaseListView {
  get name() {
    return 'Administrators'
  }

  get url() {
    return '/administrators'
  }

  get FilterView() {
    return FilterView
  }

  get ListItemHeaderView() {
    return ListItemHeaderView
  }

  get ListItemView() {
    return ListItemView
  }
}

export default props => <List collection={new Collection()} {...props} />
