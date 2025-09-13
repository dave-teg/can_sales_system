/* import { useEffect, useRef, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { setCredentials } from "./authSlice";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Link as MuiLink, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const PersistLogin = () => {
  const [refresh, { isLoading, isError, error, isSuccess, isUninitialized }] =
    useRefreshMutation();

  const effectRan = useRef(false);
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);

  const dispatch = useDispatch();

  const [trueSuccess, setTrueSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (effectRan.current === true || import.meta.env.MODE !== "development") {
      const verifyRefreshToken = async () => {
        try {
          const { accessToken } = await refresh().unwrap();
          dispatch(setCredentials({ accessToken }));
          setTrueSuccess(true);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.log(err);
          }
          setErrMsg(err?.status);
        }
      };

      if (!token && persist) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content;

  if (!persist) {
    content = <Outlet />;
  } else if (isLoading) {
    content = (
      <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  } else if (isError) {
    content = (
      <Box sx={{ display: "flex", justifyContent: 'center', mt: 12,   }}>
        <Alert severity="error">
          {`${error?.data?.message || errMsg} - `}
          <MuiLink
            component={RouterLink}
            to="/"
            sx={{
              ml: 0.5,
            }}
          >
            Please Login
          </MuiLink>
        </Alert>
      </Box>
    );
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (isUninitialized && token) {
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
 */
import { useEffect, useRef, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useRefreshMutation } from "./authApiSlice";
// import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { setCredentials } from "./authSlice";
import { useDispatch } from "react-redux";
import { Box, CircularProgress, Link as MuiLink, Alert } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const PersistLogin = () => {
  const [refresh, { isLoading, isError, error, isSuccess, isUninitialized }] =
    useRefreshMutation();

  const effectRan = useRef(false);
  // const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);

  const dispatch = useDispatch();

  const [trueSuccess, setTrueSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (effectRan.current === true || import.meta.env.MODE !== "development") {
      const verifyRefreshToken = async () => {
        try {
          const { accessToken } = await refresh().unwrap();
          dispatch(setCredentials({ accessToken }));
          setTrueSuccess(true);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.log(err);
          }
          setErrMsg(err?.status);
        }
      };

      if (!token) verifyRefreshToken();
    }

    return () => (effectRan.current = true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let content;

   if (isLoading) {
    content = (
      <Box sx={{ display: "flex", justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  } else if (isError) {
    content = (
      <Box sx={{ display: "flex", justifyContent: 'center', mt: 12,   }}>
        <Alert severity="error">
          {`${error?.data?.message || errMsg} - `}
          <MuiLink
            component={RouterLink}
            to="/"
            sx={{
              ml: 0.5,
            }}
          >
            Please Login
          </MuiLink>
        </Alert>
      </Box>
    );
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (isUninitialized && token) {
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
