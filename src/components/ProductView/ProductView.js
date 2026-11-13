import React from "react";
import { Container, Grid, Button, Typography } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import "./style.css";

const ProductView = ({ products, onAddToCart }) => {
  const { id } = useParams();
  const product = products.find((book) => book.id === id);

  if (!product) {
    return (
      <Container className="product-view">
        <Typography variant="h5">Book not found.</Typography>
        <Button component={Link} to="/">Continue browsing</Button>
      </Container>
    );
  }

  return (
    <Container className="product-view">
      <Grid container>
        <Grid item xs={12} md={6} className="image-wrapper">
          {product.coverUrl && (
            <img src={product.coverUrl} alt={`Cover of ${product.name}`} />
          )}
        </Grid>
        <Grid item xs={12} md={5} className="text">
          <Typography variant="h2">
            <b>{product.name}</b>
          </Typography>
          <Typography variant="h6">{product.author}</Typography>
          {product.year && (
            <Typography variant="body1">
              First published: {product.year}
            </Typography>
          )}
          <Typography variant="body1">
            Prices and purchase details are not provided by Open Library.
          </Typography>
          <br />
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <Button
                size="large"
                className="custom-button"
                onClick={() => onAddToCart(product.id, 1)}
              >
                Add to cart
              </Button>
              <Button component={Link} to="/">
                Continue browsing
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductView;
