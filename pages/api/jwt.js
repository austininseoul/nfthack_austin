var jwt = require("jsonwebtoken");

export default function handler(req, res) {
  const key = process.env.NEXT_PUBLIC_JWT_SIGNER;

  const sign = jwt.sign(
    {
      contract_address: req.body.address,
      ticket_id: req.body.ticket_id,
    },
    key
  );

  res.status(200).json({ token: sign });
}
