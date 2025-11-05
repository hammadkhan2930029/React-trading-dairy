// component/Skeletons/TableSkeleton.jsx
import React from "react";
import { Skeleton, Box } from "@mui/material";

const TableSkeleton = () => {
  return (
    <Box sx={{ width: "100%", p: 2 }}>
      {/* Table header */}
      <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />

      {/* Simulated table rows */}
      {[...Array(5)].map((_, i) => (
        <Box key={i} sx={{ display: "flex", gap: 2, mb: 1 }}>
          <Skeleton variant="rectangular" width="20%" height={40} />
          <Skeleton variant="rectangular" width="20%" height={40} />
          <Skeleton variant="rectangular" width="20%" height={40} />
          <Skeleton variant="rectangular" width="20%" height={40} />
        </Box>
      ))}
    </Box>
  );
};

export default TableSkeleton;
