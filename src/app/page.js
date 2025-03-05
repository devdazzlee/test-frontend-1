"use client";

import BuySellPanel from "@/Components/Buysellpanel";
import { ToastContainer } from "react-toastify";
export default function Page() {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "#121212",
          color: "#ffffff",
          padding: "12px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      />

      <BuySellPanel />
    </>
  );
}
