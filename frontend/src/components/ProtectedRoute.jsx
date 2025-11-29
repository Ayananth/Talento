import {Navigate} from "react-router-dom"
import {jwtDecode} from "jwt-decode"
import api from "../apis"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { useEffect, useState } from "react"

function ProtectedRoute({children}){
    const [isAuthorized, SetIsAuthorized] = useState(null);
    useEffect(()=>{
        auth().catch(()=> SetIsAuthorized(false))

    }, [])
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            const res = await api.post("api/token/refresh/",{
                refesh: refreshToken
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                SetIsAuthorized(true)
            } else {
                SetIsAuthorized(false)
            }
        } catch(error){
            console.log(error);
            SetIsAuthorized(false)
        }

    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token){
            SetIsAuthorized(false);
            return;
        }

    }

    if (isAuthorized===null){
        return <div>checking authorization...Loading...</div>
    }

    return isAuthorized ? children: <Navigate to="/login/" />



}

export default ProtectedRoute