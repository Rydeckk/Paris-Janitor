import { country } from "../types/types"

export async function getListPays(): Promise<{pays: country[]}> {
    const url = new URL("https://restcountries.com/v3.1/all")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem("token")})
    const response = await fetch(url.toString(), {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    let pays: country[] = data.map((pays: any) => ({id: pays.flag, name: pays.translations.fra.common}))
    
    pays = pays.sort((a:country,b:country) => a.name.localeCompare(b.name))

    return {pays}
}