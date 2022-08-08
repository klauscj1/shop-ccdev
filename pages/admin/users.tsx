import { PeopleOutlined } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layouts";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Grid, MenuItem, Select } from "@mui/material";
import useSWR from "swr";
import { FullScreenLoading } from "../../components/ui";
import { IUser } from "../../interfaces";
import { tesloApi } from "../../api";

const UsersPage = () => {
  const { data, error } = useSWR<IUser[]>("/api/admin/users");

  const [users, setUsers] = useState<IUser[]>([]);
  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <FullScreenLoading />;

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const prevUsers = users.map((user) => ({
      ...user,
    }));
    const updatedUsers = users.map((user) => ({
      ...user,
      role: userId === user._id ? newRole : user.role,
    }));
    setUsers(updatedUsers);

    console.log({ userId, newRole });
    try {
      await tesloApi.put("/admin/users", {
        userId,
        role: newRole,
      });
      console.log("Actualizado");
    } catch (error) {
      setUsers(prevUsers);
      console.log(error);
      alert("No se pudo actualizar el rol del usuario");
    }
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: "Correo", width: 250 },
    { field: "name", headerName: "Nombre completo", width: 300 },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            onChange={(event) => onRoleUpdated(row.id, event.target.value)}
            sx={{ width: "300px" }}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="super-user">SuperUsuario</MenuItem>
            <MenuItem value="SEO">SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user) => ({
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));
  return (
    <AdminLayout title="Usuarios" subtitle="Mantenimientos de usuarios" icon={<PeopleOutlined />}>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, witdh: "100%" }}>
          <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]}></DataGrid>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
