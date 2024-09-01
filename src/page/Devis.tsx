import { useState } from "react";
import { DevisForm } from "../component/Document/DevisForm";
import { DevisData } from "../types/types";
import { DevisResult } from "../component/Document/DevisResult";

export function Devis() {
    const [devisData, setDevisData] = useState<DevisData>()
    const [isFormDevis, setIsFormDevis] = useState<boolean>(true)

    const handleSubmit = (devisData: DevisData) => {
        setDevisData(devisData)
        setIsFormDevis(false)
    }

    return (
        <div>
            {isFormDevis && (<DevisForm onSubmit={(devisData) => handleSubmit(devisData)} devisData={devisData}/>)}
            {!isFormDevis && devisData && (<DevisResult devisData={devisData} onUpdate={() => setIsFormDevis(true)}/>)}
        </div>
    )
}