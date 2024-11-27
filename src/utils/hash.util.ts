import * as argon2 from "argon2";
export const hash=async(key:string)=>{
    return await argon2.hash(key);
}

export const verifyHash = async(hash:string, string:string)=>{
    return await argon2.verify(hash, string);
}