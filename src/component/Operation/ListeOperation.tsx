import { useState, useEffect } from "react"
import { useUserContext } from "../../main"
import { Operation, typeServiceString } from "../../types/types"
import { getListOperationPJ, getMyListOperation } from "../../request/requestOperation"
import { formatDateToLocalString } from "../../utils/utils-function"

export function ListeOperation() {
    const [operations, setOperations] = useState<Operation[]>([])
    const [total, setTotal] = useState(0)
    const user = useUserContext()
    
    useEffect(() => {
        const fetchListOperations = async () => {
            if(user.user) {
                if(user.user.role.isAdmin) {
                    const listOperations = (await getListOperationPJ()).operations

                    if(listOperations) {
                        setOperations(listOperations)
                        const total = listOperations.reduce((acc, ope) => ope.type === "gagne" ? (+acc + +ope.montant) : (+acc - +ope.montant),0)
                        setTotal(total)
                    }
                } else {
                    const listOperations = (await getMyListOperation()).operations
                    if(listOperations) {
                        setOperations(listOperations)
                        const total = listOperations.reduce((acc, ope) => ope.type === "gagne" ? (+acc + +ope.montant) : (+acc - +ope.montant),0)
                        setTotal(total)
                    }
                }
            } 
        }

        fetchListOperations()
        
    }, [user.user])

    return (
        <div className="div_detail">
            <div className="div_liste">
                <label className="title">Liste des transactions</label>
                <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info">Description</label>
                    </div>
                    <div>
                        <label className="label_info">Montant</label>
                    </div>
                    <div>
                        <label className="label_info">Effectué le</label>
                    </div>
                </div>
            {operations.map((operation) => (
                <div key={operation.id} className="div_row" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info_classic">{operation.description}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{operation.type === "gagne" ? "+ " : "- "}{operation.montant} €</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(operation.dateExecuter)}</label>
                    </div>
                </div>))}
                <label className="label_info"><b>Montant total gagné TTC </b> : {total} €</label>
            </div>
        </div>
    )
}