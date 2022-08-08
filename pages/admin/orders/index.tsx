import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { AdminLayout } from "../../../components/layouts";
import useSWR from "swr";
import { IOrder } from "../../../interfaces/order";
import { FullScreenLoading } from "../../../components/ui";
import { IUser } from "../../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "Orden ID", width: 250 },
  { field: "email", headerName: "Correo", width: 250 },
  { field: "name", headerName: "Nombre completo", width: 250 },
  { field: "total", headerName: "Monto total", width: 110 },
  {
    field: "isPaid",
    headerName: "Pagada",
    width: 250,
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPad ? (
        <Chip variant="outlined" label="Pagada" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      );
    },
  },
  { field: "numberProduct", headerName: "Numero de productos", align: "center" },
  {
    field: "check",
    headerName: "Ver orden",

    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver order
        </a>
      );
    },
  },
  { field: "createdAt", headerName: "F. Creación ", width: 250 },
];

const OrdersPage = () => {
  const { data, error } = useSWR<IOrder[]>("/api/admin/orders");
  if (!data && !error) {
    return <FullScreenLoading />;
  }
  const rows = data!.map((order) => ({
    id: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    numberProduct: order.numberOfItems,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout title="Ordenes" subtitle="Revisión de ordenes" icon={<ConfirmationNumberOutlined />}>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, witdh: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]}></DataGrid>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
