import { CardCvcElement, CardElement, CardExpiryElement, CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { StripeCardElement, StripeCardNumberElement } from '@stripe/stripe-js';
import { payeReservation } from "../request/requestReservation";

interface PaiementProps {
    montant: number
    onSuccess: () => void
    onCancel: () => void
}

export function Paiement({montant, onSuccess, onCancel}: PaiementProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const clientSecret = await payeReservation(montant*100)

        if (!stripe || !elements) {
            return;
        }

        const cardNumberElement = elements.getElement(CardNumberElement);

        const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret.clientSecret, {
            payment_method: {
            card: cardNumberElement as StripeCardNumberElement,
            },
        }
        );

        if (error) {
            if(error.message) setErrorMessage("Paiement refusé !")
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess()
        }
    }

    return (
        <div className="div_devis" style={{margin: "2% 35%", width: "fit-content"}}>
            <form onSubmit={handleSubmit} className="div_liste">
                <div className="div_devis_champs div_form">
                    <label>Numéro de carte</label>
                    <CardNumberElement />
                </div>
                <div className="div_devis_champs">
                    <div className="div_form" style={{width: "200px"}}>
                        <label >Date d'expiration</label>
                        <CardExpiryElement />
                    </div>
                    <div className="div_form" style={{width: "200px"}}>
                        <label>CVC</label>
                        <CardCvcElement />
                    </div>
                </div>
                
                <label className="label_info"><b>Montant à payer</b> : {montant} €</label>

                <div className="div_flex_row" style={{justifyContent: "center"}}>
                    <button type="submit" className="button" disabled={!stripe}>Payer</button>
                    <button type="button" className="button" onClick={onCancel}>Annuler</button> 
                </div>
                {errorMessage && <label className="label_error">{errorMessage}</label>}
            </form>
        </div>
        
    );
}