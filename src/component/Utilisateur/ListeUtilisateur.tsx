import { useEffect, useState } from "react"
import { CreateBannissement, UserInfoWithId } from "../../types/types"
import { useUserContext } from "../../main"
import { createBannissement, getListUser, getListUserNonBanni, updateUser } from "../../request/requestUser"
import { PopupUpdateRole } from "./PopupUpdateRole"
import { PopupBannissement } from "./PopupBannissement"

export function ListeUtilisateur() {
    const [users, setUsers] = useState<UserInfoWithId[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenBanni, setIsOpenBanni] = useState(false)
    const [userUpdate, setUserUpdate] = useState<UserInfoWithId>()
    const [userBan, setUserBan] = useState<UserInfoWithId>()
    const user = useUserContext()

    useEffect(() => {
        const fetchListUser = async () => {
            const listeUser = (await getListUserNonBanni()).users
            
            if(listeUser) {
                console.log(listeUser)
                setUsers(listeUser)
            }
        }

        fetchListUser()
    }, [])

    const handleClickUpdate = (user: UserInfoWithId) => {
        setUserUpdate(user)
        setIsOpen(true)
    }

    const handleUpdateUser = async (userUpdated: UserInfoWithId) => {
        await updateUser(userUpdated)
        setUsers(users.map((user) => user.id === userUpdated.id ? userUpdated : user))
    }

    const handleClickBan = (user: UserInfoWithId) => {
        setUserBan(user)
        setIsOpenBanni(true)
    }

    const handleBannirUser = async (userBan: UserInfoWithId, banni: CreateBannissement) => {
        const userBanni = await createBannissement(userBan,banni)
        if(userBanni) {
            setUsers(users.filter((user) => user.id !== userBanni.id))
            setIsOpenBanni(false)
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
                        <label className="label_info">Numéro de téléphone</label>
                    </div>
                    <div>
                        <label className="label_info">Email</label>
                    </div>
                    <div>
                        <label className="label_info">Rôle</label>
                    </div>
                    <div>
                        <label className="label_info">Actions</label>
                    </div>
                </div>
            {users.map((user) => (
                <div key={user.id} className="div_row" style={{justifyContent: "space-between"}}>
                    <div>
                        <label className="label_info_classic">{user.lastName}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{user.firstName}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{user.phone}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{user.email}</label>
                    </div>
                    <div>
                        <label className="label_info_classic">{user.role.name}</label>
                    </div>
                    <div>
                        <img src="/icone/crayon.png" className="little_icone_clickable" onClick={() => handleClickUpdate(user)}/>
                        <button className="button_delete" onClick={() => handleClickBan(user)}>X</button>
                    </div>
                </div>))}
            </div>
            {isOpen && userUpdate && (<PopupUpdateRole isOpen={isOpen} onClose={() => setIsOpen(false)} userUpdate={userUpdate} onUpdate={(user) => handleUpdateUser(user)}/>)}
            {isOpenBanni && userBan && (<PopupBannissement isOpen={isOpenBanni} onAdd={(user, banni) => handleBannirUser(user, banni)} onClose={() => setIsOpenBanni(false)} user={userBan}/>)}
        </div>
    )
}