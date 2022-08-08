import { db } from ".";
import { Order, Product, User } from "../models";

export const getNumberOfOrders = async (): Promise<number> => {
  await db.connect();
  const ordersNumber = await Order.count();
  await db.disconnect();
  return ordersNumber;
};

export const getPaidOrders = async (): Promise<number> => {
  await db.connect();
  const ordersNumberPaid = await Order.count({ isPaid: { $eq: true } });
  await db.disconnect();
  return ordersNumberPaid;
};

export const getNumberOfClients = async (): Promise<number> => {
  await db.connect();
  const clientsNumber = await User.count({ role: { $eq: "client" } });
  await db.disconnect();
  return clientsNumber;
};

export const getNumberOfProducts = async (): Promise<number> => {
  await db.connect();
  const productsNumber = await Product.count();
  await db.disconnect();
  return productsNumber;
};

export const getProductsWithNoInventory = async (): Promise<number> => {
  await db.connect();
  const productsWithNoInventoryNumber = await Product.count({ inStock: { $eq: 0 } });
  await db.disconnect();
  return productsWithNoInventoryNumber;
};

export const getLowInventory = async (): Promise<number> => {
  await db.connect();
  const LowInventoryNumber = await Product.count({ inStock: { $lte: 10 } });
  await db.disconnect();
  return LowInventoryNumber;
};
