import fs from 'fs';
import path from 'path';
import https from 'https'
import axios from 'axios'
import { fstat } from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

const getHttpsAgent = () => {
  const pfxFile = path.join(process.cwd(), '/cert/certificate.pfx');
  const pfxContent = fs.readFileSync(pfxFile);
  const httpsAgent = new https.Agent({
    pfx: pfxContent,
    passphrase: process.env.passphrase
  })
  // console.log('getHttpsAgent httpsAgent = ' + JSON.stringify(httpsAgent, null, 4));
  return httpsAgent;
}

const getResponseHeaders = (response: Response) => {
  const result = Object.fromEntries(response.headers.entries());
  return result;
}

const ApixService = {
  getAuthLink: async() => {
    const params = [];
    params.push('response_type=code');
    params.push(`client_id=${process.env.clientId}`);
    params.push(`redirectUrl=${process.env.redirectUrl}`);
    params.push(`scope=${process.env.scope}`);
    params.push(`state=${process.env.state}`);
    const url = process.env.AUTH_URL + (params.length > 0 ?
      '?' + params.join('&') :
      '');
  
    // console.log('getAuthLink: url = ' + url);
    let result = null;
    const headers = {
      Accept: '*/*'
    };

    const httpsAgent = getHttpsAgent();
    // console.log('httpsAgent = ' + httpsAgent);

    try {
      const options: RequestInit = {
        headers,
        mode: 'cors',
        redirect: 'manual'
      };
      const response = await fetch(url, options);
      const resHeaders = getResponseHeaders(response);
      // console.log('response: ', response);
      const jsonObj = await response.json();
      // let resHeaders = null;
      // if (jsonObj.httpCode === '302') {
      //   resHeaders = response.headers;
      // }
      // console.log('jsonObj: ', jsonObj);
      // resHeaders = response.headers;
      // console.log('getAuthLink: resHeaders: ', resHeaders);
      result = resHeaders.location;
      // console.log('getAuthLink: result: ', result);

    } catch(err) {
      console.log('err: ', err);
      throw err;
    }

    return result;
  },

  getConsentIdInfo: async (consentId: string) => {
    const url = process.env.ACCOUNT_CONSENTS_URL as string + '/' + consentId;
    const headers = {
      'X-Request-Id': process.env.requestId,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Tsp-User-Id': process.env.tspUserId,
      'X-IBM-Client-Id': process.env.clientId,
      'X-IBM-Client-Secret': process.env.clientSecret
    };
    let result = null;
    try {
      const response = await axios.get(
        url,
        {
          httpsAgent: getHttpsAgent(),
          headers
        }
      );
      result = response.data.data;
    } catch(err) {
      throw err;
    }
    return result;

  },

  getConsentId: async () => {
    const url = process.env.ACCOUNT_CONSENTS_URL as string;
    const body = {
      "data": {
          "permissions": [
              "ReadAccountStatus",
              "ReadAccountBalance",
              "ReadAccountTransaction"
          ],
          "expirationDate": "2023-06-22T08:06:20Z",
          "transactionFromDate": "2022-06-22T08:06:20Z",
          "transactionToDate": "2023-06-22T08:06:20Z"
      }
    };

    const headers = {
      'X-Request-Id': process.env.requestId,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Tsp-User-Id': process.env.tspUserId,
      'X-IBM-Client-Id': process.env.clientId,
      'X-IBM-Client-Secret': process.env.clientSecret
    };

    let result = null;
    try {
      const response = await axios.post(
        url,
        body,
        {
          httpsAgent: getHttpsAgent(),
          headers
        }
      );
      result = response.data.data;
    } catch(err) {
      throw err;
    }
    console.log('6: result: ', result);

    return result;
  }
}

export default ApixService;
