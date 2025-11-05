import React from "react";
import { Skeleton, Box } from "@mui/material";

const FormSkeleton = () => {
  return (
    <Box sx={{ width: 300, padding: 2 }}>
      <Skeleton variant="text" width="80%" height={40} />
      <Skeleton variant="rectangular" width="100%" height={50} sx={{ my: 1 }} />
      <Skeleton variant="rectangular" width="100%" height={50} sx={{ my: 1 }} />
      <Skeleton variant="rounded" width="60%" height={40} />
    </Box>
  );
};

export default FormSkeleton;