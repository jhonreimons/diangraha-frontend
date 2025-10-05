"use client";

import { Suspense } from "react";
import AddServiceForm from "./AddServiceForm";

export default function AddServicePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading form...</div>}>
      <AddServiceForm />
    </Suspense>
  );
}
