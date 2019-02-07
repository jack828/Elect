import React from 'react'
import BaseListView from '../../lib/base-list-view'
import FilterView from './ListFilter'
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

  get ListItemView() {
    return ListItemView
  }
}

export default () => <List collection={new Collection()} />
