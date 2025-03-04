import { connectDB } from '@/lib/mongodb';
import { Message } from '@/models/message';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const message = await Message.create(req.body);
      return res.status(201).json(message);
    } catch (error) {
      return res.status(500).json({ error: 'メッセージの保存に失敗しました' });
    }
  }

  if (req.method === 'GET') {
    try {
      const messages = await Message.find().sort({ createdAt: 1 });
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ error: 'メッセージの取得に失敗しました' });
    }
  }

  return res.status(405).json({ error: 'メソッドが許可されていません' });
} 