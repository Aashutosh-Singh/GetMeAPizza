// app/verify/page.js
"use client";

import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading verification page...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
