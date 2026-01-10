import axios from 'axios';



export interface LoginResponse {
 success: boolean;
 statusCode: number;
 message: string;
 data?: {
   accessToken: string;
   refreshToken: string;
 };
}



export async function login(
 email: string,
 password: string,
 url: string,
): Promise<LoginResponse> {
 const response = await axios.post<LoginResponse>(
   url,
   {
     email,
     password,
   },
   {
     headers: {
       'Content-Type': 'application/json',
     },
   },
 );


 return response.data;
}


