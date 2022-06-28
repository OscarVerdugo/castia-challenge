import axios from "axios";
import {Request, Response} from "express";
import _ from "lodash";

import { GitHubUser } from './../models/github_user.model';

class GitHubController{
    private githubApiUrl = "https://api.github.com";
    private githubToken: string | undefined;

    constructor(){
        this.githubToken = process.env.GITHUB_TOKEN;
    }

    async getTopUsers(request: Request, response: Response){
        const search : string = request.params["search"];
        console.log(this.githubApiUrl);
        const result = await axios.get(`${this.githubApiUrl}/search/users`,{
            headers:{
                "Authorization":`token ${this.githubToken ?? "without-token"}`
            },
            params:{
            "q":`${search} in:user`,
            "sort":"repositories",
            "per_page":"5"
        }});
        if(result.status == 200){
            const rawUsers = result.data["items"] as any[] ?? [];
            const users = await Promise.all(rawUsers.map(async (user)=>{
                return await this.getUser(user["login"]);
            }));
            return response.json(_.orderBy(users,["followers"],["desc"]));
        }
        return response.status(500).json({message:"Something goes wrong :("});
    }

    private async getUser(username: string): Promise<GitHubUser | null>{
        return new Promise(async (resolve, _reject)=>{
            const result = await axios.get(`${this.githubApiUrl}/users/${username}`,{headers:{
                "Authorization":`token ${this.githubToken ?? "without-token"}`
            }});
            if(result.status == 200){
                const data = result.data;
                resolve({
                    username:data["login"],
                    repositories:data["public_repos"],
                    followers:data["followers"]
                } as GitHubUser);
            }else{
                resolve(null);
            }
        });
    }
}

export default GitHubController;