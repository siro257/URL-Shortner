import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url, slug } = req.body;
  try {
    await prisma.shortLink.create({
      data: {
        url: url,
        slug: slug,
      },
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        return res.status(409).json({ error: 'slug name already exists' });
      }
    }
    throw e;
  }

  return res.status(201).json({ url: url, slug: slug });
};
