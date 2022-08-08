import { Box, Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { ProductList } from "../../components/products";

import { GetServerSideProps } from "next";
import { dbProducts } from "../../database";
import { IProduct } from "../../interfaces/products";

interface Props {
  products: IProduct[];
  foundProducts: boolean;
  query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  return (
    <ShopLayout title={"Teslo shop - Search"} pageDescription={"Busqueda de los mejores productos"}>
      <Typography variant="h1" component={"h1"}>
        Buscar producto
      </Typography>
      {foundProducts ? (
        <Typography variant="h2" component={"h2"} sx={{ marginBottom: 1 }} textTransform="capitalize">
          Termino: {query}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" component={"h2"} sx={{ marginBottom: 1 }}>
            No encontramos ningun producto
          </Typography>
          <Typography variant="h2" color="secondary" component={"h2"} sx={{ marginBottom: 1, ml: 1 }}>
            {query}
          </Typography>
        </Box>
      )}
      <ProductList products={products} />
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string };
  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  let products = await dbProducts.getAllProductsByTerm(query);
  const foundProducts = products.length > 0;
  // TODO: retornornar otros productos
  if (!foundProducts) {
    products = await dbProducts.getAllProducts();
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  };
};

export default SearchPage;
