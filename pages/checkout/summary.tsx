import { Button, Card, CardContent, Divider, Grid, Typography, Box, Link, Chip } from "@mui/material";
import Cookies from "js-cookie";

import NextLink from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { CartContext } from "../../context/cart/CartContext";

const SummaryPage = () => {
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);
  const router = useRouter();
  useEffect(() => {
    if (!Cookies.get("firstName")) {
      router.push("/checkout/address");
    }
  }, []);

  if (!shippingAddress) {
    return <></>;
  }

  const onCreateOrder = async () => {
    setIsPosting(true);
    const { hasError, message } = await createOrder(); // todo: depende del resultado
    if (hasError) {
      setIsPosting(false);
      setErrorMessage(message);
      return;
    }
    router.replace(`/orders/${message}`);
  };

  return (
    <ShopLayout title="Resumen de  orden" pageDescription="Resumen de la orden de compra">
      <Typography variant="h1">Resumen de la orden</Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen ({numberOfItems} {numberOfItems === 1 ? "producto" : "productos"})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1">Dirección de entrega</Typography>
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar </Link>
                </NextLink>
              </Box>

              <Typography>
                {shippingAddress!.firstName} {shippingAddress!.lastName}
              </Typography>
              <Typography>
                {shippingAddress!.address}
                {shippingAddress!.address2 ? `, ${shippingAddress!.address2}` : ""}
              </Typography>
              <Typography>
                {shippingAddress!.city}, {shippingAddress!.zip}
              </Typography>
              <Typography>{shippingAddress!.country}</Typography>
              <Typography>{shippingAddress!.phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar </Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  sx={{ py: 1 }}
                  onClick={onCreateOrder}
                  disabled={isPosting}
                >
                  Confirmar Orden
                </Button>
                <Chip
                  color="error"
                  label={errorMessage}
                  sx={{ display: errorMessage ? "flex" : "none", mt: 2 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
