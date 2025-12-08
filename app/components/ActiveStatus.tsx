"use client";

import useActiveChannel from "../hooks/useActiveChannel";

const ActiveStatus = () => {
  useActiveChannel();
  console.log('[ActiveStatus] Component mounted - presence hook running');

  return null;
};

export default ActiveStatus;