import { FormEvent, FormHTMLAttributes, useEffect, useState } from "react"
import { login } from "../request/requestAuth"
import { useLocation, useNavigate } from "react-router-dom"
import { useUserContext } from "../main"
import { getUser } from "../request/requestUser"
import { DevisData } from "../types/types"
import { addServiceLogement, createLogement } from "../request/requestLogement"

interface LoginProps {
    from: string
}

export function Login({from}: LoginProps) {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>()
    const [passwordIsVisible, setPasswordIsVisible] = useState<boolean>(false)
    const [devisData, setDevisData] = useState<DevisData>()
    const user = useUserContext()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        try {
            setDevisData(location.state.devisData)
            setEmail(location.state.devisData.email)
        } catch (error) {}
    }, [])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(from === "admin") {
            const res = await login({email: email, password: password, type: "admin"})
            if(res) {
                setError(res)
                return
            }
        } else if (from === "owner") {
            const res = await login({email: email, password: password, type: "owner"})
            if(res) {
                console.log(res)
                setError(res)
                return
            }
        } else {
            const res = await login({email: email, password: password, type: "traveler"})
            if(res) {
                setError(res)
                return
            }
        }

        if(devisData) {
            const logementCreated = await createLogement({
                nom: devisData.typeBien,
                adresse: devisData.adresse,
                codePostal: devisData.codePostal,
                ville: devisData.ville,
                pays: devisData.pays,
                typeLogement: devisData.typeBien,
                typeLocation: devisData.typeLocation,
                nbChambres: devisData.nbChambres,
                capacite: devisData.capacite,
                surface: devisData.surface,
                prixNuit: devisData.prixNuit
            })

            if(logementCreated) {
                devisData.services.forEach(async (service) => {
                    await addServiceLogement(logementCreated.id, service.id)
                })
            }
        }

        const userFound = await getUser()
        if(userFound) {
            user.setUser(userFound)
            if(from === "admin") {
                navigate("/master")
            } else if (from === "owner") {
                navigate("/owner")
            } else {
                navigate("/")
            }
        }
    }

    const togglePasswordIsVisible = () => {
        setPasswordIsVisible(!passwordIsVisible)
    }

    return (
        <div className="div_auth">
            <form className="div_auth_content" onSubmit={handleSubmit}>
                <label className="title">Connexion</label>
                <div className="div_form">
                    <label>Email : </label>
                    <input type="email" className="input_auth" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                </div>

                <div className="div_form">
                    <label>Password : </label>
                    <div className="div_img_in_input">
                        <input type={passwordIsVisible ? "text" : "password"} className="input_auth" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                        <img src="/icone/oeil.png" onClick={togglePasswordIsVisible}></img>
                    </div>
                </div>
                {error && (<label className="label_error">{error}</label>)}
                <div className="div_center">
                    <button className="button">Se connecter</button>
                </div>
            </form>
        </div>
    )
}