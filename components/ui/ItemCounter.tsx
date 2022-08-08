import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface Props {
  currentValue: number;
  maxValue: number;
  onUpdateQuantity: (newValue: number) => void;
}

export const ItemCounter: FC<Props> = ({ currentValue, onUpdateQuantity, maxValue }) => {
  const addOrRemove = (value: number) => {
    if (value === -1) {
      if (currentValue === 1) return;
      return onUpdateQuantity(currentValue - 1);
    } else {
      if (currentValue >= maxValue) return;
      return onUpdateQuantity(currentValue + 1);
    }
  };

  return (
    <Box display="flex" alignContent="center">
      <IconButton onClick={() => addOrRemove(-1)}>
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }}> {currentValue} </Typography>
      <IconButton onClick={() => addOrRemove(+1)}>
        <AddCircleOutline />
      </IconButton>
    </Box>
  );
};
