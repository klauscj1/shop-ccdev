import { FC, ReactElement, useEffect, useReducer } from "react";

import { ICartProduct, IOrder } from "../../interfaces";
import { CartContext, cartReducer } from "./";
import { OrderSummary } from "../../components/cart/OrderSummary";
import Cookies from "js-cookie";
import { ShippingAddress } from "../../interfaces";
import { tesloApi } from "../../api";
import axios, { AxiosError } from "axios";

export interface CartState {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  shippingAddress?: ShippingAddress;
}

type ServerError = { message: string };

const CART_INITIAL_STATE: CartState = {
  isLoaded: false,
  cart: Cookies.get("cart") ? JSON.parse(Cookies.get("cart")!) : [],
  numberOfItems: 0,
  subTotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

interface Props {
  children: ReactElement | ReactElement[];
}

export const CartProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  // Efecto
  useEffect(() => {
    try {
      const cookieProducts = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")!) : [];
      dispatch({ type: "[Cart] - LoadCart from cookies | storage", payload: cookieProducts });
    } catch (error) {
      dispatch({ type: "[Cart] - LoadCart from cookies | storage", payload: [] });
    }
  }, []);

  useEffect(() => {
    if (Cookies.get("firstName")) {
      const data = {
        firstName: Cookies.get("firstName") || "",
        lastName: Cookies.get("lastName") || "",
        address: Cookies.get("address") || "",
        address2: Cookies.get("address2") || "",
        zip: Cookies.get("zip") || "",
        city: Cookies.get("city") || "",
        country: Cookies.get("country") || "",
        phone: Cookies.get("phone") || "",
      };
      dispatch({ type: "[Cart] - Load address from cookies ", payload: data });
    }
  }, []);

  useEffect(() => {
    Cookies.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfItems = state.cart.reduce((prev, current) => current.quantity + prev, 0);
    const subTotal = state.cart.reduce((prev, current) => current.quantity * current.price + prev, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const tax = subTotal * taxRate;
    const total = subTotal + tax;
    const orderSummary = {
      numberOfItems,
      subTotal,
      tax,
      total,
    };
    dispatch({ type: "[Cart] - Update order summary", payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (product: ICartProduct) => {
    const productInCart = state.cart.some((p) => p._id === product._id);
    if (!productInCart)
      return dispatch({ type: "[Cart] - Update products in cart", payload: [...state.cart, product] });

    const productInCartButDifferentSize = state.cart.some(
      (p) => p._id === product._id && p.size === product.size
    );
    if (!productInCartButDifferentSize)
      return dispatch({ type: "[Cart] - Update products in cart", payload: [...state.cart, product] });

    // Acumular
    const updatedProducts = state.cart.map((p) => {
      if (p._id !== product._id) return p;
      if (p.size !== product.size) return p;

      // Actualizar la cantidad
      p.quantity += product.quantity;
      return p;
    });

    dispatch({ type: "[Cart] - Update products in cart", payload: updatedProducts });
  };

  const updateCartQuantity = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Change cart quantity", payload: product });
  };

  const removeCartProduct = (product: ICartProduct) => {
    dispatch({ type: "[Cart] - Remove product in cart", payload: product });
  };

  const updateAddress = (data: ShippingAddress) => {
    Cookies.set("firstName", data.firstName);
    Cookies.set("lastName", data.lastName);
    Cookies.set("address", data.address);
    Cookies.set("address2", data.address2 || "");
    Cookies.set("zip", data.zip);
    Cookies.set("city", data.city);
    Cookies.set("country", data.country);
    Cookies.set("phone", data.phone);
    dispatch({ type: "[Cart] - Update address", payload: data });
  };

  const createOrder = async (): Promise<{ hasError: boolean; message: string }> => {
    if (!state.shippingAddress) {
      throw new Error("No hay direccion de entrega");
    }

    const body: IOrder = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numberOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      tax: state.tax,
      total: state.total,
      isPaid: false,
    };
    try {
      const { data } = await tesloApi.post<IOrder>("/orders", body);
      dispatch({ type: "[Cart] - Order complete" });
      return { hasError: false, message: data._id! };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errx = error as AxiosError<ServerError>;
        return {
          hasError: true,
          message: errx.response?.data?.message!,
        };
      }
      return {
        hasError: true,
        message: "Error no controlado. Hable con el administrador",
      };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
