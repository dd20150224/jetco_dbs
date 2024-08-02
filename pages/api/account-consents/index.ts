// pages/api/data
import { useContext } from 'react';
import NextCors from 'nextjs-cors';
import ApixService from '@/services/ApixService';
import DbsServices from '@/services/DbsService';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // use connect based middleware
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  console.log('a');
  const responseObj = await ApixService.getConsentId();
  const consentId = responseObj.consentId;
  console.log('b: consentId = ' + consentId);
  await DbsServices.updateConsentId(consentId);
  res.json({consentId});
}
  
export default handler;