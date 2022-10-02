import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/client';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const slug = Array.isArray(req.query['slug']) ? req.query['slug'][0] : req.query['slug'];

  if (!slug) {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: 'please use with a slug' }));

    return;
  }

  const data = await prisma.shortLink.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    res.statusCode = 404;

    res.send(JSON.stringify({ message: 'slug not found' }));

    return;
  }

  return res.send(data);
};
