import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { capitalize } from "lodash";

export default function Comment({data}) {
  console.log(data)
  return (
    <List sx={{ width: "100%", maxWidth: '95%', bgcolor: "background.paper" }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={`${capitalize(data.comment_owner.first_name)} ${capitalize(data.comment_owner.middle_name)} ${capitalize(data.comment_owner.last_name)}`}
          primaryTypographyProps={{fontWeight: 'medium'}}
          secondary={
            <React.Fragment>
              {/* <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Ali Connors
              </Typography> */}
              {` — ${data.comment}`}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
}
