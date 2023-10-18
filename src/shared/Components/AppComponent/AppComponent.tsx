import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "../AppRouter";

export function AppComponent() {
  
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}