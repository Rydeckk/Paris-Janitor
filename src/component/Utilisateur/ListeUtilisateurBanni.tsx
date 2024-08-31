import { useEffect, useState } from "react"
import { Bannissement, UserInfoWithId } from "../../types/types"
import { getListUserBanni, updateBannissement } from "../../request/requestUser"
import { formatDateToLocalString } from "../../utils/utils-function"
import { PopupBannissement } from "./PopupBannissement"

export function ListeUtilisateurBanni() {
    const [userBanni, setUserBanni] = useState<UserInfoWithId[]>([])
    const [userUpdate, setUserUpdate] = useState<UserInfoWithId>()
    const [bannissementUpdate, setBannissementUpdate] = useState<Bannissement>()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const fetchListBanni = async () => {
            const listeBanni = await (await getListUserBanni()).users
            if(listeBanni) {
                setUserBanni(listeBanni)
            }
        }

        fetchListBanni()
    }, [])

    const handleClickUpdate = (user: UserInfoWithId, banni: Bannissement) => {
        setUserUpdate(user)
        setBannissementUpdate(banni)
        setIsOpen(true)
    }

    const handleUpdateBannissement = async (userUpdate: UserInfoWithId, bannissementUpdate: Bannissement) => {
        const banniUpdate = await updateBannissement(userUpdate,bannissementUpdate.id, bannissementUpdate.dateFin)
        if(banniUpdate) {
            userUpdate.bannissements = userUpdate.bannissements.map((banni) => banni.id === bannissementUpdate.id ? bannissementUpdate : banni)
            setUserBanni(userBanni.map((user) => user.id === userUpdate.id ? userUpdate : user))
            setIsOpen(false)
        }
    }

    const handleDeleteBannissement = async (userDeban: UserInfoWithId, bannissementUpdate: Bannissement) => {
        const banniUpdate = await updateBannissement(userDeban,bannissementUpdate.id, new Date())
        if(banniUpdate) {
            setUserBanni(userBanni.filter((user) => user.id !== userDeban.id))
        }
    }

    return (
        <div className="div_detail" style={{ height: "800px"}}>
            <div className="div_liste">
                <div className="div_row div_header" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info">Nom</label>
                    </div>
                    <div>
                        <label className="label_info">Prénom</label>
                    </div>
                    <div>
                        <label className="label_info">Motif</label>
                    </div>
                    <div>
                        <label className="label_info">Date de début</label>
                    </div>
                    <div>
                        <label className="label_info">Date de fin</label>
                    </div>
                    <div>
                        <label className="label_info">Actions</label>
                    </div>
                </div>
            {userBanni.map((user) => (
                <div key={user.id} className="div_row" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info_classic">{user.lastName}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{user.firstName}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{user.bannissements[0].motif}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(user.bannissements[0].dateDebut)}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{formatDateToLocalString(user.bannissements[0].dateFin)}</label>
                    </div>
                    <div>
                        <img src="/icone/crayon.png" className="little_icone_clickable" onClick={() => handleClickUpdate(user,user.bannissements[0])}/>
                        <button className="button_delete" onClick={() => handleDeleteBannissement(user, user.bannissements[0])}>X</button>
                    </div>
                </div>))}
            </div>
            {isOpen && bannissementUpdate && userUpdate && (<PopupBannissement onClose={() => setIsOpen(false)} isOpen={isOpen} user={userUpdate} bannissement={bannissementUpdate} onUpdate={(user,banni) => handleUpdateBannissement(user, banni)}/>)}
        </div>
    )
}