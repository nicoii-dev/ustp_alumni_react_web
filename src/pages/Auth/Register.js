import { Link as RouterLink } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import { Card, Link, Container, Typography, CardContent } from "@mui/material";
// hooks
import useResponsive from "../../lib/hooks/useResponsive";
// components
import Page from "../../components/Page";
// sections
import RegisterForm from "../../components/sections/auth/register/RegisterForm";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1006%26quot%3b)' fill='none'%3e%3cpath d='M20.59 93.99 a179.49 179.49 0 1 0 358.98 0 a179.49 179.49 0 1 0 -358.98 0z' fill='rgba(20%2c 82%2c 184%2c 0.19)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M999.02 121.62 a143.72 143.72 0 1 0 287.44 0 a143.72 143.72 0 1 0 -287.44 0z' fill='rgba(20%2c 82%2c 184%2c 0.19)' class='triangle-float3'%3e%3c/path%3e%3cpath d='M894.1257294504218 278.9998211214717L771.1883833703496 241.41410252769208 733.6026647765699 364.35144860776427 856.5400108566421 401.93716720154396z' fill='rgba(20%2c 82%2c 184%2c 0.19)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M503.68 544.82 a184.95 184.95 0 1 0 369.9 0 a184.95 184.95 0 1 0 -369.9 0z' fill='rgba(20%2c 82%2c 184%2c 0.19)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M676.1133104774522 436.335950586826L731.764274391199 356.8581374001311 652.286461204504 301.2071734863843 596.6354972907573 380.6849866730792z' fill='rgba(20%2c 82%2c 184%2c 0.19)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M363.8436978253439 412.7097361935133L399.8217896681294 295.03070028147533 282.1427537560914 259.05260843868984 246.1646619133059 376.73164435072783z' fill='rgba(20%2c 82%2c 184%2c 0.19)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1058.1843493336223 247.38709088660352L1141.4515319491281 269.6984652244431 1080.495723671462 164.11990827109778z' fill='rgba(20%2c 82%2c 184%2c 0.19)' class='triangle-float2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1006'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cstyle%3e %40keyframes float1 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-10px%2c 0)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float1 %7b animation: float1 5s infinite%3b %7d %40keyframes float2 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-5px%2c -5px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float2 %7b animation: float2 4s infinite%3b %7d %40keyframes float3 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(0%2c -10px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float3 %7b animation: float3 6s infinite%3b %7d %3c/style%3e%3c/defs%3e%3c/svg%3e")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "grid",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
  backgroundColor: "#2065D1",
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 620,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 5),
}));

// ----------------------------------------------------------------------

export default function Register() {
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");

  return (
    <Page title="Register">
      <RootStyle>
        <HeaderStyle>
          <Typography variant="h4" sx={{ color: "white" }}>
            USTP Jasaan Alumni Association
          </Typography>
          <Typography variant="h4" sx={{ color: "white" }}>
            Management System with
          </Typography>
          <Typography variant="h4" sx={{ color: "white" }}>
            Graduate Tracer
          </Typography>
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography
              variant="h5"
              sx={{ px: 5, mt: 0, mb: 5, color: "white" }}
            >
              Be updated to announcements and events, Register now!
            </Typography>
            <img
              alt="register"
              src="/static/ustp_logo.png"
              style={{
                height: 300,
                width: 300,
                alignSelf: "center",
                borderRadius: 150,
                objectFit: "contain",
              }}
            />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Get started absolutely free.
                </Typography>

                <Typography
                  sx={{ color: "text.secondary", mb: 5 }}
                ></Typography>

                {/* <AuthSocial /> */}

                <RegisterForm />

                {smUp && (
                  <Typography variant="body2" sx={{ mt: 3, alignSelf: "end" }}>
                    Already have an account? {""}
                    <Link
                      variant="subtitle2"
                      component={RouterLink}
                      to="/login"
                    >
                      Login
                    </Link>
                  </Typography>
                )}

                {!smUp && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 3, textAlign: "center" }}
                  >
                    Already have an account?{" "}
                    <Link
                      variant="subtitle2"
                      to="/login"
                      component={RouterLink}
                    >
                      Login
                    </Link>
                  </Typography>
                )}
              </CardContent>
            </Card>
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
