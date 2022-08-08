import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const WomenPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=women");

  return (
    <ShopLayout title={"Teslo shop - women"} pageDescription={"Encuentra los mejores productos para ellas"}>
      <Typography variant="h1" component={"h1"}>
        Mujeres
      </Typography>
      <Typography variant="h2" component={"h2"} sx={{ marginBottom: 1 }}>
        Producto para ellas
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
