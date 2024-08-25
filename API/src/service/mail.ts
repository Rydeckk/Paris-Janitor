import nodemailer from 'nodemailer';
import { User } from '../database/entities/user';

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    attachments?: Array<{
        filename: string;
        path?: string;
        content?: string | Buffer;
    }>;
}

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    from: process.env.EMAIL_NAME
});

export const sendEmail = async (mailOptions: MailOptions): Promise<void> => {
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
    }
}

export const bodyMailDevis = (nom: string, prenom: string): string => {

    return "Bonjour M./Mme " + nom + " " + prenom 
        + ", \n\nMerci de nous faire confiance pour la gestion de votre bien !"
        + "\n\nVous trouverez votre devis en pièce jointe au format PDF. " 
        + "\n\nNous espérons vous revoir très rapidement sur notre plateforme !"
        + "\n\nCordialement"
}