// pages/api/example.js

export default function handler(req, res) {
  // req is the NextApiRequest object
  // res is the NextApiResponse object
  // handle your request here

  // Example: Handling a GET request
  if (req.method === 'GET') {
    res.status(200).json({ message: 'Handling GET request' });
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
