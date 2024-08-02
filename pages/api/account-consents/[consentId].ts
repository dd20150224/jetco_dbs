import { useContext } from 'react';
// pages/api/data
import NextCors from 'nextjs-cors';
import { useRouter } from 'next/router';

import ApixService from '@/services/ApixService';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // use connect based middleware
  console.log('handler: req.query: ', req.query);
  const consentId = req.query.consentId as string;

  // const router = useRouter();
  // const query = router.query;
  // console.log('query: ', query);
  // const { consentId } = router.query;

  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  console.log('consentd = ' + consentId);
  const responseObj = await ApixService.getConsentIdInfo(consentId);
  res.json(responseObj);
}
  
export default handler;