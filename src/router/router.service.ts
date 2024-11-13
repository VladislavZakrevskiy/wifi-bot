import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

interface AuthData {
  username: string;
  password: string;
}

interface RouterOSResponse {
  message?: string;
  error?: string;
}

@Injectable()
export class RouterOSService {
  private readonly routerosUrl = process.env.ROUTER_URL;

  constructor(private readonly httpService: HttpService) {}

  private async authenticate({ password, username }: AuthData) {
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    return `Basic ${auth}`;
  }

  // Добавление пользователя в Hotspot
  async addHotspotUser(username: string, password: string, profile: string) {
    const authHeader = await this.authenticate({ password, username });
    const url = `${this.routerosUrl}/ip/hotspot/user`;

    const userData = {
      name: username,
      password: password,
      profile: profile,
    };

    try {
      const response = await this.httpService.axiosRef.post<
        AxiosResponse<RouterOSResponse>
      >(url, userData, {
        headers: {
          Authorization: authHeader,
        },
      });

      console.log(`User ${username} added successfully`);
      console.log('Add user', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  }

  // вкл/выкл пользователя из HotSpot
  async enableHotspotUser({ password, username }: AuthData) {
    const authHeader = await this.authenticate({ password, username });
    const url = `${this.routerosUrl}/ip/hotspot/user/${username}`;

    try {
      const response = await this.httpService.axiosRef.patch<
        AxiosResponse<RouterOSResponse>
      >(
        url,
        { disabled: false },
        {
          headers: {
            Authorization: authHeader,
          },
        },
      );

      console.log(`User ${username} enabled successfully`);
      console.log('Enable user', response.data);
      return response.data;
    } catch (error) {
      console.error('Error enabling user:', error);
      throw error;
    }
  }
}
