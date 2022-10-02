import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as crypto from 'crypto';

const makeSlug = (length: number) => {
  const slug = crypto.randomBytes(length).toString('hex');

  return slug;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { url, slug } = req.body;
  if (!slug) {
    slug = makeSlug(3);
  }
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
