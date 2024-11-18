import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RouterOSService {
  private async authenticate() {
    const auth = Buffer.from(`${process.env.ROUTER_ADMIN_USER}:${process.env.ROUTER_ADMIN_PASSWORD}`).toString('base64');
    return auth;
  }

  async addUser(username: string, password: string, profile: string = 'default'): Promise<string> {
    if (process.env.MODE === 'dev') return;

    const auth = await this.authenticate();

    try {
      const response = await axios.post(
        `${process.env.ROUTER_URL}/ip/hotspot/user`,
        {
          name: username,
          password: password,
          profile: profile,
        },
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        },
      );

      if (response.status === 200) {
        return `User ${username} added successfully!`;
      } else {
        throw new Error('Failed to add user');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async removeUser(username: string): Promise<string> {
    if (process.env.MODE === 'dev') return;

    const auth = await this.authenticate();

    try {
      const usersResponse = await axios.get(`${process.env.ROUTER_URL}/ip/hotspot/user`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      const user = usersResponse.data.find((user: any) => user.name === username);
      if (!user) {
        throw new Error('User not found');
      }

      const userId = user.id;

      const deleteResponse = await axios.delete(`${process.env.ROUTER_URL}/ip/hotspot/user/${userId}`, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      if (deleteResponse.status === 200) {
        return `User ${username} removed successfully!`;
      } else {
        throw new Error('Failed to remove user');
      }
    } catch (error) {
      throw new Error(`Error removing user: ${error.message}`);
    }
  }
}
