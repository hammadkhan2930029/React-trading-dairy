// component/Skeletons/withSkeleton.js
import React from "react";
import { useSelector } from "react-redux";
import FormSkeleton from "./FormSkeleton";
import TableSkeleton from "./TableSkeleton";

const SkeletonMapper = ({ componentName }) => {
  switch (componentName) {
    case "Login":
    case "Register":
    case "BrokerForm":
      return <FormSkeleton />;
    case "Holdings":
    case "marketSummary":
    case "marketOverview":
      return <TableSkeleton />;
    default:
      return <FormSkeleton />; // fallback
  }
};

const withSkeleton = (WrappedComponent, sliceName) => {
  return function WithSkeletonWrapper(props) {
    // ✅ Get loading state from Redux dynamically
    const loading = useSelector((state) => state[sliceName]?.loading);

    if (loading) {
      const componentName = WrappedComponent.displayName || WrappedComponent.name;
      return <SkeletonMapper componentName={componentName} />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withSkeleton;
