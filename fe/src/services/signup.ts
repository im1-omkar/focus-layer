import axios from "axios"

interface SignupInterface {
    name : string,
    email : string,
    password : string

}

export const signup = async ({name, email, password} : SignupInterface)=>{
    try{
        await axios.post("http://localhost:3000/api/auth/signup",{
            name,
            email,
            password
        })
        return true;
    }
    catch(err){
        if(err instanceof Error){
            console.log("error while signingUp")
        }
        return  false
    }
}
