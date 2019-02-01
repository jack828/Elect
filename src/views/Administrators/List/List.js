import React from 'react'
import BaseListView from '../../lib/base-list-view'
import FilterView from './ListFilter'
import ListItemView from './ListItemView'
import Collection from './collection'

class List extends BaseListView {
  get name() {
    return 'Administrators'
  }

  get FilterView() {
    return FilterView
  }

  get ListItemView() {
    return ListItemView
  }
}

export default () => <List collection={new Collection()} />
