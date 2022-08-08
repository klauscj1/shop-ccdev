import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";
import NextLink from "next/link";

import { useContext, useState } from "react";
import { UiContext } from "../../context";

export const AdminNavbar = () => {
  const { toggleOpenMenu } = useContext(UiContext);

  return (
    <AppBar>
      <Toolbar>
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center" underline="none" color="black">
            <Typography variant="h6">Teslo | </Typography>
            <Typography sx={{ ml: 0.5 }}>Shop </Typography>
          </Link>
        </NextLink>
        <Box flex={1} />

        <Button onClick={toggleOpenMenu}>Menu</Button>
      </Toolbar>
    </AppBar>
  );
};
