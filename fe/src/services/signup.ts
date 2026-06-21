import axios from "axios"

interface SignupInterface {
    name : string | null | undefined,
    email: string | null | undefined,
    password: string | null | undefined

}

interface SigninInterface {
    email: string | null | undefined,
    password: string | null | undefined
}

export const handleSignup = async ({name, email, password} : SignupInterface)=>{
    if(!name || !email || !password) return false;
    try{
    
        const response = await axios.post("http://localhost:3000/api/auth/signup",{
            name,
            email,
            password
        })
        return response.data;
    }
    catch(err){
        if(err instanceof Error){
            console.log(err.message)
            console.log("error while signingUp")
        }
        return  false
    }
}


export const handleSignin = async({ email, password } : SigninInterface )=>{

    if ( !email || !password) return false;

    try{
        const response = await axios.post("http://localhost:3000/api/auth/signin",{
            email,
            password
        })
        return response.data;
    }
    catch(err){
        if(err instanceof Error){
            console.log(err.message)
            console.log("error while signing in ")
        }
        return false
    }
}
