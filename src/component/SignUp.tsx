import { FormEvent, FormHTMLAttributes, useEffect, useState } from "react"
import { login, signUp } from "../request/requestAuth"
import { useLocation, useNavigate } from "react-router-dom"
import { useUserContext } from "../main"
import { getUser } from "../request/requestUser"
import { DevisData } from "../types/types"
import { addServiceLogement, createLogement } from "../request/requestLogement"

interface SignUpProps {
    from: string
}

export function SignUp({from}: SignUpProps) {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [nom, setNom] = useState<string>("")
    const [prenom, setPrenom] = useState<string>("")
    const [tel, setTel] = useState<string>("")
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
            setNom(location.state.devisData.nom)
            setPrenom(location.state.devisData.prenom)
            setTel(location.state.devisData.tel)
        } catch (error) {}
    }, [])

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    
        if (from === "owner") {
            const res = await signUp({email: email, password: password, firstName: prenom, lastName: nom, phone: tel, type: "owner"})
            if(res) {
                setError(res)
                return
            } else {
                await login({email: email, password: password, type: "owner"})
            }
        } else {
            const res = await signUp({email: email, password: password, firstName: prenom, lastName: nom, phone: tel, type: "traveler"})
            if(res) {
                setError(res)
                return
            } else {
                await login({email: email, password: password, type: "traveler"})
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
                <label className="title">Inscription</label>
                <div className="div_form">
                    <label>Nom : </label>
                    <input className="input_auth" value={nom} onChange={(e) => setNom(e.target.value)}></input>
                </div>
                <div className="div_form">
                    <label>Prénom : </label>
                    <input className="input_auth" value={prenom} onChange={(e) => setPrenom(e.target.value)}></input>
                </div>
                <div className="div_form">
                    <label>Téléphone : </label>
                    <input className="input_auth" value={tel} onChange={(e) => setTel(e.target.value)}></input>
                </div>
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
                    <button className="button">S'inscrire</button>
                </div>
            </form>
        </div>
    )
}