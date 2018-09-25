import Button from '@material-ui/core/Button'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { getUsersList } from '../../lib/api/users'

import sendRequest from '../../lib/api/sendRequest'

class Admin extends React.Component {
  static async getInitialProps() {
    const users = await sendRequest('/api/v1/admin/stats', {
      method: 'GET'
    })

    return {
      users: users
    }
  }

  updateStats = async () => {
    const users = await sendRequest('/api/v1/admin/stats/update')
  }

  render () {
    return (
      <div>
        <h5>Users</h5>
        <Button
          onClick={this.updateStats}
        >Update Stats</Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Points2</TableCell>
              <TableCell>win_streak</TableCell>
              <TableCell>max_win_streak</TableCell>
              <TableCell>points_trend</TableCell>
              <TableCell>points_max</TableCell>
              <TableCell>points_min</TableCell>
              <TableCell>match_played</TableCell>
              <TableCell>match_win</TableCell>
              <TableCell>match_crawl</TableCell>
              <TableCell>match_crawled</TableCell>
              <TableCell>match_as_defender</TableCell>
              <TableCell>match_as_striker</TableCell>
              <TableCell>win_as_defender</TableCell>
              <TableCell>win_as_striker</TableCell>
              <TableCell>match_goals_made</TableCell>
              <TableCell>match_goals_conceded</TableCell>
              <TableCell>match_goals_made_as_defender</TableCell>
              <TableCell>match_goals_made_as_striker</TableCell>
              <TableCell>match_goals_conceded_as_defender</TableCell>
              {/* <TableCell>last_matches</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {
              this.props.users.map(user => {
                return (
                  <TableRow key={user.slug}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.points}</TableCell>
                    <TableCell>{user.points2}</TableCell>
                    <TableCell>{user.stats.win_streak}</TableCell>
                    <TableCell>{user.stats.max_win_streak}</TableCell>
                    <TableCell>{user.stats.points_trend}</TableCell>
                    <TableCell>{user.stats.points_max}</TableCell>
                    <TableCell>{user.stats.points_min}</TableCell>
                    <TableCell>{user.stats.match_played}</TableCell>
                    <TableCell>{user.stats.match_win}</TableCell>
                    <TableCell>{user.stats.match_crawl}</TableCell>
                    <TableCell>{user.stats.match_crawled}</TableCell>
                    <TableCell>{user.stats.match_as_defender}</TableCell>
                    <TableCell>{user.stats.match_as_striker}</TableCell>
                    <TableCell>{user.stats.win_as_defender}</TableCell>
                    <TableCell>{user.stats.win_as_striker}</TableCell>
                    <TableCell>{user.stats.match_goals_made}</TableCell>
                    <TableCell>{user.stats.match_goals_conceded}</TableCell>
                    <TableCell>{user.stats.match_goals_made_as_defender}</TableCell>
                    <TableCell>{user.stats.match_goals_made_as_striker}</TableCell>
                    <TableCell>{user.stats.match_goals_conceded_as_defender}</TableCell>
                    {/* <TableCell>{user.stats.last_matches ? user.last_matches.join(', ') : ''}</TableCell> */}
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default Admin
