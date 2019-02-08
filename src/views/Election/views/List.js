import React from 'react'
import BaseListView from '../../lib/base-list-view'
import FilterView from './ListFilter'
import ListItemHeaderView from './ListItemHeaderView'
import ListItemView from './ListItemView'
import Collection from '../collection/election'

class List extends BaseListView {
  get name() {
    return 'Elections'
  }

  get url() {
    return '/elections'
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
