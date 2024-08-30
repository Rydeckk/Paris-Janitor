import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "../class/classes.css"
import { Home } from "./page/Traveler";
import { Master } from "./page/Master";
import { Owner } from "./page/Owner";

export function App() {
    return (
        <div>
            <Routes>
                <Route path={"/*"} element={<Home />}/>
                <Route path={"/master/*"} element={<Master />} />
                <Route path={"/owner/*"} element={<Owner />} />
            </Routes>
        </div>
    )
}

