import Link from 'next/link'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import CountUp from 'react-countup'

import Layout from '../../components/Layout.js'
import { getUsersList, deleteUser } from '../../lib/api/users'
import { styleH1, styleCard, styleCardContainer, styleCardContent, styleBigAvatar } from '../../lib/SharedStyles'

import Avatar from '@material-ui/core/Avatar'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import {
  AlienIcon,
  BombIcon,
  BoneIcon,
  CandycaneIcon,
  CannabisIcon,
  CatIcon,
  ChessKingIcon,
  DogIcon,
  DuckIcon,
  EmoticonPoopIcon,
  FoodIcon,
  GhostIcon,
  NinjaIcon,
  NukeIcon,
  PigIcon,
  PirateIcon,
  RocketIcon,
  SkullIcon,
  SoccerFieldIcon,
  SoccerIcon,
  TrophyIcon,
  WeatherSnowyIcon
} from '../../components/IconComponents'
import lightBlue from '@material-ui/core/colors/lightBlue'

const rowHeaderStyle = {
  height: 25
}

const cellStyle = {
  border: '1px solid #C6C6C6',
  padding: '0 10px',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  minWidth: 46,
}

class IndexUser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: props.users || [],
      userDeleted: false
    }
  }

  static async getInitialProps() {
    const users = await getUsersList()

    return {
      users: users
    }
  }

  async removeUser (user, e) {
    e.preventDefault()
    const removedUser = await deleteUser(user._id)
    const localUserList = this.state.users.filter( el => el._id !== removedUser._id )
    this.setState({ users: localUserList, userDeleted: true })
  }

// https://static.nexilia.it/bitchyf/2018/05/cristiano-malgioglio-danzando-800x500.jpg

  render() {
    return (
      <Layout>
        <h1 style={styleH1}>Ranking</h1>
        <Divider />
        <List>
          {this.props.users && this.props.users.map((user, index) => (
            <Link as={`/users/${user.slug}`} href={`/users/update/?slug=${user.slug}`}>
            <ListItem
              key={user.slug}
              style={{overflow: 'hidden', padding: '14px 0'}}
              divider
            >

                <Typography
                  style={{
                    padding: '0px 6px',
                    fontSize: 22,
                    minWidth: '36px',
                  }}
                >
                  {index + 1}
                </Typography>
                <ListItemAvatar>
                  <Avatar
                    alt={user.name}
                    src={user.avatarUrl}
                    style={{
                      height: 80,
                      margin: '0px 10px',
                      width: 80
                    }}
                  />
                </ListItemAvatar>
                <ListItemText
                  style={{minWidth: '100px', padding: '0px 6px'}}
                  primary={user.name}
                  primaryTypographyProps={{
                    style: {
                      fontSize: 15,
                      overflowX: 'hidden',
                      textOverflow: 'ellipsis',
                    }
                  }}
                  secondary={<CountUp start={1200} end={user.points} duration={3}/>}
                  secondaryTypographyProps={{
                    style: {
                      fontSize: 18,
                      color: lightBlue[500]
                    }
                  }}
                />

                <Table style={{ width: 150 }}>
                  <TableHead>
                    <TableRow style={rowHeaderStyle}>
                      <TableCell style={cellStyle}>P</TableCell>
                      <TableCell style={cellStyle}>W</TableCell>
                      <TableCell style={cellStyle}>GM</TableCell>
                      <TableCell style={cellStyle}>GC</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell style={cellStyle}><CountUp start={0} end={user.stats.match_played} duration={2.00}/></TableCell>
                      <TableCell style={cellStyle}><CountUp start={0} end={user.stats.match_win} duration={2.20}/></TableCell>
                      <TableCell style={cellStyle}><CountUp start={0} end={user.stats.match_goals_made} duration={3.00}/></TableCell>
                      <TableCell style={cellStyle}><CountUp start={0} end={user.stats.match_goals_conceded} duration={1.80}/></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {/*
                  THIS SHOULD BE USED FOR THE BADGES
                <ListItemSecondaryAction>
                  <PirateIcon />
                  <RocketIcon />
                </ListItemSecondaryAction> */}
            </ListItem>
              </Link>
          ))}
        </List>
      </Layout>
    )
  }

}
export default IndexUser
