import { useEffect, useState } from "react";
import { Role, Service, ServiceCreate, TypeService, typeServiceString, UserInfoWithId } from "../../types/types";
import { getListRole } from "../../request/requestRole";

interface PopupUpdateRoleProps {
    isOpen: boolean;
    onClose: () => void;
    userUpdate: UserInfoWithId
    onUpdate: (userUpdated: UserInfoWithId) => void
}

export function PopupUpdateRole({isOpen, onClose, userUpdate, onUpdate}: PopupUpdateRoleProps) {
    const [nom, setNom] = useState("")
    const [prenom, setPrenom] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [selectedRoleId, setSelectedRoleId] = useState(0)
    const [listRole, setListRole] = useState<Role[]>([])
    const [montant, setMontant] = useState(0)

    useEffect(() => {
        const fetchListRole = async () => {
            const listRole = (await getListRole()).roles
            if(listRole) {
                setListRole(listRole)
            }
        }

        fetchListRole()
    }, [])

    useEffect(() => {
        setNom(userUpdate.lastName)
        setPrenom(userUpdate.firstName)
        setPhone(userUpdate.phone)
        setEmail(userUpdate.email)
        setSelectedRoleId(userUpdate.role.id)
    }, [userUpdate, listRole])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const roleChoose = listRole.filter((role) => role.id === selectedRoleId)[0]
        onUpdate({
            id: userUpdate.id, 
            lastName: nom,
            firstName: prenom, 
            phone: phone, 
            email: email,
            role: roleChoose,
            bannissements: userUpdate.bannissements,
            notes: userUpdate.notes
        })

    }

    if (!isOpen) return null;

    return (
        <div className="popup_background">
            <div className="popup_content">
                <button className="close_popup" onClick={onClose}>&times;</button>
                <label className="title">Modification d'un utilisateur</label> 
                <form onSubmit={handleSubmit}>
                    <div className="div_form">
                        <label>Nom</label>
                        <input value={nom} disabled={true}></input>
                    </div>
                    <div className="div_form">
                        <label>Prénom</label>
                        <input value={prenom} disabled={true}></input>
                    </div>
                    <div className="div_form">
                        <label>Phone</label>
                        <input value={phone} disabled={true}></input>
                    </div>
                    <div className="div_form">
                        <label>Email</label>
                        <input value={email} disabled={true}></input>
                    </div>
                    <div className="div_form">
                        <label>Rôle</label>
                        <select value={selectedRoleId} onChange={(e) => setSelectedRoleId(+e.target.value)}>
                            {listRole.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button className="button" type="submit">Modifier</button>
                </form>
            </div>
        </div>
    );
}