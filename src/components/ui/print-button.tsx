"use client";

import { Printer } from "lucide-react";
import { buttonClasses } from "./button";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClasses({ variant: "outline", size: "sm" })}>
      <Printer size={15} /> Yazdır
    </button>
  );
}
