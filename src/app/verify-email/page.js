import VerifyEmail from "@/components/auth/VerifyEmail";
import { Suspense } from "react";
import React from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmail />
      </Suspense>
    </div>
  );
};

export default page;
