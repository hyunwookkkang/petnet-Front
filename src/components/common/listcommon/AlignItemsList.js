import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function AlignItemsList() {
  return (
    <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Tori" src="/assets/common/tori1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="점메추받아요"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                배고파요..?
              </Typography>
              {" 마유유 마라탕 0.5단계렛츠고"}
            </React.Fragment>
          }
        />
      </ListItem>

      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="" src="/assets/common/tori2.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="토리산책코스"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                형동이가 랩을 한다-
              </Typography>
              {"홍..호옹...홍...."}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Cindy Baker" src="/assets/common/tori3.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="소코마데다."
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                닝겐..-
              </Typography>
              {'そこまでだ…'}
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
}
