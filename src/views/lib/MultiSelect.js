import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Multiselect from 'react-widgets/lib/Multiselect'
import {
  Input
} from 'reactstrap'

class CustomMultiSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.value,
      options: [],
      loading: true
    }
    this.handleSelectChange = this.handleSelectChange.bind(this)
    this.renderTextField = this.renderTextField.bind(this)
  }

  componentDidMount() {
    // load
    fetch(this.props.apiUrl)
      .then(res => res.json())
      .then((data) => {
        // TODO handle error
        this.setState({
          options: data.results,
          loading: false
        })
      })
  }

  handleSelectChange(data) {
    this.setState({ data })
    // Compatability with regular change handlers
    this.props.onChange({
      target: {
        name: this.props.name,
        value: data,
        getAttribute: () => {}
      }
    })
  }

  renderTextField(field) {
    switch (typeof field) {
      case 'string':
        return field
      case 'object':
        return field.name
          ? field.name
          : `${field.firstName} ${field.lastName}`
      default:
        return field
    }
  }

  render() {
    return (
      <>
        <Multiselect
          busy={this.state.loading}
          caseSensitive={false}
          minLength={3}
          filter="contains"
          textField={this.renderTextField}
          defaultValue={this.state.data}
          onChange={this.handleSelectChange}
          data={this.state.options}
          inputProps={{
            id: this.props.id,
            name: this.props.name
          }}
        />
        {/* For FormFeedback display, forgive me */}
        <Input type="hidden" invalid={this.props.invalid} />
      </>
    )
  }
}

CustomMultiSelect.defaultProps = {
  value: []
}

CustomMultiSelect.propTypes = {
  value: PropTypes.array,
  name: PropTypes.string.isRequired,
  apiUrl: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  invalid: PropTypes.bool.isRequired
}

export default CustomMultiSelect
