import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const KidPage: NextPage = () => {
  const { products, isLoading } = useProducts("/products?gender=kid");

  return (
    <ShopLayout title={"Teslo shop - Kids"} pageDescription={"Encuentra los mejores productos para niños"}>
      <Typography variant="h1" component={"h1"}>
        Niños
      </Typography>
      <Typography variant="h2" component={"h2"} sx={{ marginBottom: 1 }}>
        Producto para niños
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidPage;
