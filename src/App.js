import React, { useState, useEffect } from "react";
import { CssBaseline } from "@material-ui/core";
import { fetchBooks } from "./lib/books";
import Products from "./components/Products/Products";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import ProductView from "./components/ProductView/ProductView";
import Manga from "./components/Manga/Manga";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import loadingImg from "./assets/loader.gif";
import "./style.css";
import Fiction from "./components/Fiction/Fiction";
import Biography from "./components/Bio/Biography";

const App = () => {
  const [products, setProducts] = useState([]);
  const [mangaProducts, setMangaProducts] = useState([]);
  const [fictionProducts, setFictionProducts] = useState([]);
  const [bioProducts, setBioProducts] = useState([]);
  const [featureProducts, setFeatureProducts] = useState([]);
  const [cart, setCart] = useState({ line_items: [] });
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchStoreData = async () => {
    try {
      const [products, mangaProducts, fictionProducts, bioProducts] =
        await Promise.all([
          fetchBooks("literature"),
          fetchBooks("manga"),
          fetchBooks("fiction"),
          fetchBooks("biographies"),
        ]);

      setProducts(products);
      setMangaProducts(mangaProducts);
      setFeatureProducts(products.slice(0, 6));
      setFictionProducts(fictionProducts);
      setBioProducts(bioProducts);
    } catch (error) {
      setLoadError(error.message || "Unable to load books from Open Library.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAllBooks = () => [
    ...new Map(
      [...products, ...mangaProducts, ...fictionProducts, ...bioProducts].map(
        (book) => [book.id, book]
      )
    ).values(),
  ];

  const handleAddToCart = (productId, quantity) => {
    const book = getAllBooks().find((item) => item.id === productId);
    if (!book) return;

    setCart((currentCart) => {
      const existingItem = currentCart.line_items.find(
        (item) => item.id === productId
      );
      const line_items = existingItem
        ? currentCart.line_items.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...currentCart.line_items, { ...book, quantity }];

      return { line_items };
    });
  };

  const handleUpdateCartQty = (lineItemId, quantity) => {
    setCart((currentCart) => ({
      line_items: currentCart.line_items
        .map((item) =>
          item.id === lineItemId ? { ...item, quantity } : item
        )
        .filter((item) => item.quantity > 0),
    }));
  };

  const handleRemoveFromCart = (lineItemId) => {
    setCart((currentCart) => ({
      line_items: currentCart.line_items.filter(
        (item) => item.id !== lineItemId
      ),
    }));
  };

  const handleEmptyCart = () => {
    setCart({ line_items: [] });
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const totalItems = cart.line_items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div>
      {isLoading ? (
        <div className="loader">
          <img src={loadingImg} alt="Loading books" />
        </div>
      ) : loadError ? (
        <div role="alert" style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Unable to load books</h2>
          <p>Check your connection and reload the page.</p>
          <p>{loadError}</p>
        </div>
      ) : (
        <>
          <Router>
            <div style={{ display: "flex" }}>
              <CssBaseline />
              <Navbar totalItems={totalItems} />
              <Switch>
                <Route exact path="/">
                  <Products
                    products={products}
                    featureProducts={featureProducts}
                    onAddToCart={handleAddToCart}
                    handleUpdateCartQty
                  />
                </Route>
                <Route exact path="/cart">
                  <Cart
                    cart={cart}
                    onUpdateCartQty={handleUpdateCartQty}
                    onRemoveFromCart={handleRemoveFromCart}
                    onEmptyCart={handleEmptyCart}
                  />
                </Route>
                <Route path="/product-view/:id" exact>
                  <ProductView
                    products={getAllBooks()}
                    onAddToCart={handleAddToCart}
                  />
                </Route>
                <Route path="/manga" exact>
                  <Manga
                    mangaProducts={mangaProducts}
                    onAddToCart={handleAddToCart}
                    handleUpdateCartQty
                  />
                </Route>
                <Route path="/fiction" exact>
                  <Fiction
                    fictionProducts={fictionProducts}
                    onAddToCart={handleAddToCart}
                    handleUpdateCartQty
                  />
                </Route>
                <Route path="/biography" exact>
                  <Biography
                    bioProducts={bioProducts}
                    onAddToCart={handleAddToCart}
                    handleUpdateCartQty
                  />
                </Route>
              </Switch>
            </div>
          </Router>
          <Footer />
        </>
      )}
    </div>
  );
};

export default App;
