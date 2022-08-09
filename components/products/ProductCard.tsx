import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from "@mui/material";
import NextLink from "next/link";
import { FC, useMemo, useState } from "react";
import { IProduct } from "../../interfaces";

interface Props {
  product: IProduct;
}

export const ProductCard: FC<Props> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoader, setIsImageLoader] = useState(false);

  const productImage = useMemo(() => {
    return isHovered ? `${product.images[1]}` : `${product.images[0]}`;
  }, [isHovered]);
  return (
    <Grid item xs={6} sm={4} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Card>
        <NextLink href={`/product/${product.slug}`} passHref prefetch={false}>
          <Link>
            <CardActionArea>
              {product.inStock === 0 && (
                <Chip
                  color="primary"
                  label="No disponible"
                  sx={{ position: "absolute", zIndex: 99, top: "10px", left: "10px" }}
                />
              )}
              <CardMedia
                component="img"
                image={productImage}
                alt={product.title}
                className="fadeIn"
                onLoad={() => setIsImageLoader(true)}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
      <Box sx={{ mt: 1, display: isImageLoader ? "block" : "none" }} className="fadeIn">
        <Typography fontWeight={700}>{product.title}</Typography>
        <Typography fontWeight={500}>{`$${product.price}`}</Typography>
      </Box>
    </Grid>
  );
};
