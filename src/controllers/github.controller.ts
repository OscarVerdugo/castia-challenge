import axios from "axios";
import { Request, Response } from "express";
import _ from "lodash";

import { GitHubUser } from "./../models/github_user.model";

class GitHubController {
  private githubApiUrl = "https://api.github.com";
  private githubToken: string | undefined;

  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN;
  }

  private getRequestHeaders() {
    return {
      Authorization: `token ${this.githubToken ?? "without-token"}`,
    };
  }

  async getTopUsers(request: Request, response: Response) {
    const search: string = request.params["search"];

    try {
      const result = await axios.get(`${this.githubApiUrl}/search/users`, {
        headers: this.getRequestHeaders(),
        params: {
          q: `${search} in:user`,
          sort: "repositories",
          per_page: "5",
        },
      }).catch((error)=>{
        throw new Error(error);
      });
      
      if (result.status == 200) {
        const rawUsers = (result.data["items"] as any[]) ?? [];
        const users = await Promise.all(
          rawUsers.map(async (user) => {
            return await this.getUser(user["login"]);
          })
        );
        return response.json(_.orderBy(users, ["followers"], ["desc"]));
      }
      return response.status(500).json({ message: "Something goes wrong :(" });
      
    } catch (error: any) {
      return response
        .status(500)
        .json({ message: "Something goes wrong :(", error: error.message });
    }
  }

  private async getUser(username: string): Promise<GitHubUser | null> {
    try {
        const result = await axios.get(`${this.githubApiUrl}/users/${username}`, {
            headers: this.getRequestHeaders(),
          }).catch((error)=>{
            throw new Error(error);
          });

          if (result.status == 200) {
            const data = result.data;
            return {
              username: data["login"],
              repositories: data["public_repos"],
              followers: data["followers"],
            } as GitHubUser;
          } else {
            throw new Error(`Request error ${result.status}: ${result.data} `);
          }

    } catch (error) {
        return { username, message: "Error fetching this user"};
    }
  }
}

export default GitHubController;