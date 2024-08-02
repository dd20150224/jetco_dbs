// pages/api/data
import NextCors from 'nextjs-cors';
import ApixService from '@/services/ApixService';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // use connect based middleware
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  console.log('a');
  const authLink = await ApixService.getAuthLink();

  const authUrl = authLink +
    '&consentid=' + 
  res.redirect(authLink);
}
  
export default handler;