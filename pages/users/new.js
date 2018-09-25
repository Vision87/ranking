import React from 'react'
import Router from 'next/router'
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

import Layout from '../../components/Layout.js'
import { addNewUser } from '../../lib/api/users.js'
import { styleH1, styleForm, styleTextField, styleFormTitle, styleFormButton } from '../../lib/SharedStyles.js'
import { formText } from '../../lib/userPage'
import { newUser } from '../../lib/Layouts.js'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  radioLegend: {
    color: '#000',
    fontSize: '15px',
    marginBottom: '10px',
    marginTop: '30px',
  },
  radioLabel: {
    maxHeight: '36px',
  },
  multilineText: {
    width: '100%',
    '& > div > div': {
      minHeight: '100px'
    }
  }
})

class AddUser extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userAdded: false,
      name: '',
      avatarUrl: '',
      description: '',
      role: 'jolly',
    }
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const users = await addNewUser({
      name: this.state.name,
      avatarUrl: this.state.avatarUrl,
      description: this.state.description,
      role: this.state.role,
    })

    Router.push('/users')

    this.setState({users, userAdded: true})
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    })
  }

  render () {
    return (
      <Layout>
        <form
          autoComplete="off"
          onSubmit={this.onSubmit}
        >
          <TextField
            style={styleTextField}
            id="name"
            label="Name"
            value={this.state.name}
            onChange={this.handleChange('name')}
            margin="normal"
            required
          />
          <TextField
            style={styleTextField}
            id="avatarUrl"
            label="Avatar URL"
            value={this.state.avatarUrl}
            onChange={this.handleChange('avatarUrl')}
            margin="normal"
            required
          />
          <FormLabel className={this.props.classes.radioLegend} component="legend">Main role</FormLabel>
          <RadioGroup
            aria-label="role"
            className={this.props.classes.radioGroup}
            name="role2"
            value={this.state.role || 'jolly'}
            onChange={this.handleChange('role')}
          >
            <FormControlLabel
              className={this.props.classes.radioLabel}
              value='defender'
              control={<Radio color="primary" />}
              label="Defender"
            />
            <FormControlLabel
              className={this.props.classes.radioLabel}
              value='striker'
              control={<Radio color="primary" />}
              label="Striker"
            />
            <FormControlLabel
              className={this.props.classes.radioLabel}
              value='jolly'
              control={<Radio color="primary" />}
              label="Jolly"
            />
          </RadioGroup>
          <TextField
            className={this.props.classes.multilineText}
            id="description"
            label="Description"
            value={this.state.description}
            multiline
            onChange={this.handleChange('description')}
            margin="normal"
          />
          <Button
            variant="contained"
            style={styleFormButton}
            type="submit"
          >
            Add User
          </Button>
        </form>
      </Layout>
    )
  }
}

export default withStyles(styles)(AddUser)