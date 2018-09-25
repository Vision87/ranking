import React from 'react'
import Link from 'next/link'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InfoIcon from '@material-ui/icons/Info'
import NewMatchIcon from '@material-ui/icons/DirectionsRun'
import NewUserIcon from '@material-ui/icons/PersonAdd'
import ListIcon from '@material-ui/icons/List'
import RulesIcon from '@material-ui/icons/DeveloperBoard'

export const mainDrawerUser = (
  <div>
    <Link href="/users">
      <ListItem button>
        <ListItemIcon>
          <ListIcon/>
        </ListItemIcon>
        <ListItemText primary="User list"/>
      </ListItem>
    </Link>
    <Link href="/users/new">
      <ListItem button>
        <ListItemIcon>
          <NewUserIcon/>
        </ListItemIcon>
        <ListItemText primary="New user"/>
      </ListItem>
    </Link>
  </div>
)

export const mainDrawerMatch = (
  <div>
    <Link href="/matches">
      <ListItem button>
        <ListItemIcon>
          <ListIcon/>
        </ListItemIcon>
        <ListItemText primary="Matches list"/>
      </ListItem>
    </Link>
    <Link href="/matches/fast">
      <ListItem button>
        <ListItemIcon>
          <NewMatchIcon/>
        </ListItemIcon>
        <ListItemText primary="New match (beta)"/>
      </ListItem>
    </Link>
  </div>
)

export const mainDrawerInfo = (
  <div>
    <Link href="/rules">
      <ListItem button>
        <ListItemIcon>
          <RulesIcon/>
        </ListItemIcon>
        <ListItemText primary="Rules"/>
      </ListItem>
    </Link>
    <Link href="/about">
      <ListItem button>
        <ListItemIcon>
          <InfoIcon/>
        </ListItemIcon>
        <ListItemText primary="About"/>
      </ListItem>
    </Link>
  </div>
)
