import { Box } from "@mui/material";
import Head from "next/head";
import { FC, ReactElement } from "react";

interface Props {
  title: string;
  children: ReactElement | ReactElement[];
}
export const AuthLayout: FC<Props> = ({ title, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <Box display="flex" justifyContent="center" alignItems="center" height={"calc(100vh - 200px)"}>
          {children}
        </Box>
      </main>
    </>
  );
};
