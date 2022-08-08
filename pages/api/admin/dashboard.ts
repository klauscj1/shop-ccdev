import type { NextApiRequest, NextApiResponse } from "next";
import { dbAdmin } from "../../../database";

type Data = {
  numberOfOrders: number;
  paidOrders: number;
  notPaidOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  productsWithNoInventory: number;
  lowInventory: number; //productos con menos de 10 o
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const numberOfOrders = await dbAdmin.getNumberOfOrders();
  const paidOrders = await dbAdmin.getPaidOrders();
  const notPaidOrders = numberOfOrders - paidOrders;
  const numberOfClients = await dbAdmin.getNumberOfClients();
  const numberOfProducts = await dbAdmin.getNumberOfProducts();
  const productsWithNoInventory = await dbAdmin.getProductsWithNoInventory();
  const lowInventory = await dbAdmin.getLowInventory();
  res.status(200).json({
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  });
}
