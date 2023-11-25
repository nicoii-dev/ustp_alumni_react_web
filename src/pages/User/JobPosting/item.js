import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { Grid, capitalize, Box } from "@mui/material";
import moment from "moment";

export default function UserJobPostingItem({ jobPosting }) {

  return (
    <Card sx={{ maxWidth: "100%", marginTop: 2, backgroundColor: '#F5F5F5' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            A
          </Avatar>
        }
        title={
          <Typography
            sx={{ fontSize: 20, fontWeight: "medium" }}
          >{`${capitalize(jobPosting?.title)}`}</Typography>
        }
        subheader={moment(jobPosting.created_at).format("LL")}
      />

      <CardContent>
        <Typography variant="body1" color="text.secondary" fontSize={18}>
          {jobPosting.description}
        </Typography>
      </CardContent>
      {jobPosting.job_images.length > 1 ? (
        <Grid
          container
          spacing={{ xs: 2, md: 0 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ paddingBottom: 1, gap: 1, justifyContent: 'center' }}
        >
          {jobPosting?.job_images.map((data, index) => {
            return (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <CardMedia
                  component="img"
                  height="400vh"
                  image={`${process.env.REACT_APP_API_LOCAL_URL}/storage/` + data.url}
                  alt={`${process.env.REACT_APP_API_LOCAL_URL}/storage/` + data.url}
                  sx={{
                    objectFit: "cover",
                  }}
                />
              </Grid>
            );
          })}
        </Grid>
      ) : jobPosting.job_images.length < 1 ? null : (
        <CardMedia
          component="img"
          height="700"
          image={
            `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
            jobPosting?.job_images[0]?.url
          }
          alt={
            `${process.env.REACT_APP_API_LOCAL_URL}/storage/` +
            jobPosting?.job_images[0]?.url
          }
          sx={{
            objectFit: "contain",
            marginBottom: 1,
            // borderColor: "gray",
            // borderWidth: 1,
            // borderStyle: "solid",
          }}
        />
      )}
      {/* <Box
        display={"flex"}
        justifyContent={"space-between"}
        sx={{
          padding: 1,
          paddingLeft: 5,
          paddingRight: 5,
          borderTop: 1,
          borderColor: "#E0E0E0",
        }}
      >
        <Typography sx={{ color: "gray" }}>Like</Typography>
        <Typography sx={{ color: "gray" }}>Comment</Typography>
      </Box> */}
    </Card>
  );
}
