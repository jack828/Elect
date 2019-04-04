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
      options: [],
      loading: true
    }
    this.getTextField = this.getTextField.bind(this)
    this.getValueField = this.getValueField.bind(this)
    this.handleSelectChange = this.handleSelectChange.bind(this)
  }

  componentDidMount() {
    // Load options, and also fetch currently selected?
    fetch(`${this.props.apiUrl}`)
      .then(res => res.json())
      .then((data) => {
        // TODO handle error
        this.setState({
          options: data.results,
          loading: false
        })
      })
  }

  getTextField(field) {
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

  getValueField(field) {
    switch (typeof field) {
      case 'string':
        return field
      case 'object':
        return field._id
      default:
        return field
    }
  }

  handleSelectChange(data) {
    // this.setState({ data })
    // Compatability with regular change handlers
    console.log('handleSelectChange', data)
    this.props.onChange({
      target: {
        name: this.props.name,
        value: data.map(this.getValueField),
        getAttribute: () => {}
      }
    })
  }

  render() {
    if (this.state.loading) {
      // Cannot render multiselect until data loaded
      return null
    }

    return (
      <>
        <Multiselect
          caseSensitive={false}
          minLength={3}
          filter="contains"
          textField={this.getTextField}
          valueField={this.getValueField}
          defaultValue={this.props.value}
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
