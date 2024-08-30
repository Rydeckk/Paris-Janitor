import express, { Response } from "express"
import { Request } from "../types/express"
const stripe = require('stripe')(process.env.API_KEY_STRIPE);

export const PayeHandler = (app: express.Express) => {
    app.post('/payeStatut', async (req, res) => {
        const { sessionId } = req.body;
      
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);
          
            if (session.payment_status === 'paid') {
                res.json({ success: true });
            } else {

                res.json({ success: false });
            }
        } catch (error) {
          res.status(500).send({ error: error });
        }
    })
}