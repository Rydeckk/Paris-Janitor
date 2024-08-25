import PDFDocument from 'pdfkit';
import fs from "fs-extra"
import { devisData, typeBienString, typeLocationString } from '../types/types';



export function generatePdfDevis(devisData: devisData) {
    const doc = new PDFDocument({size: "A4", margin: 50})
    const today = new Date()
    const pdfPath = "uploads/devis/"+ today.getTime() + "_" + today.getUTCDate() + (today.getUTCMonth() + 1) + today.getUTCFullYear() + "_" + devisData.nom + "_" + devisData.prenom + ".pdf"

    const stream = fs.createWriteStream(pdfPath)

    doc.pipe(stream)
    doc.font("Helvetica")

    doc.fillColor('#444444')
		.fontSize(20)
		.text('Paris Janitor', 50, 57, {continued: false})
		.fontSize(10)
        .text(devisData.nom + " " + devisData.prenom, 200, 65, {align: "right"})
		.text('23, rue Montorgueil', 50, 80)
		.text('Paris, 75002, France', 50, 90)
		.moveDown()

    doc.fillColor('#519164')
        .fontSize(24)
        .text("Devis de votre logement", 70, 120, {align: "center"})
        .moveDown()

    doc.fillColor('#519164')
        .fontSize(16)
        .text("Résumé de votre logement",50, 180, {continued: false})
        .moveDown()

    doc.strokeColor("#519164")
        .lineWidth(1)
        .moveTo(50, 210)
        .lineTo(550, 210)
        .stroke()

    doc.fillColor('#519164')
        .font("Helvetica-Bold")
        .fontSize(12)
        .text("Adresse",50, 230, {width: 140})
        .text("Code postal",220, 230, {width: 140})
        .text("Ville",390, 230, {width: 140})
        .text("Pays", 50, 270, {width: 140})
        .text("Type de logement", 220, 270, {width: 140})
        .text("Type de location", 390, 270, {width: 140})
        .text("Nombre de chambres", 50, 310, {width: 140})
        .text("Capacité", 220, 310, {width: 140})
        .text("Surface (en m²)", 390, 310, {width: 140})
        .text("Prix de la nuit (en €)", 50, 350, {width: 140})

    doc.fillColor('black')
        .font("Helvetica")
        .fontSize(12)
        .text(devisData.adresse, 50, 245, {width: 140})
        .text(devisData.codePostal,220, 245, {width: 140})
        .text(devisData.ville,390, 245, {width: 140})
        .text(devisData.pays,50, 285, {width: 140})
        .text(typeBienString[devisData.typeBien],220, 285, {width: 140})
        .text(typeLocationString[devisData.typeLocation], 390, 285, {width: 140})
        .text(String(devisData.nbChambres),50, 325, {width: 140})
        .text(String(devisData.capacite),220, 325, {width: 140})
        .text(String(devisData.surface),390, 325, {width: 140})
        .text(String(devisData.prixNuit.toFixed(2)),50, 365, {width: 140})

    doc.strokeColor("#519164")
        .lineWidth(1)
        .moveTo(50, 258)
        .lineTo(50+140, 258)
        .stroke()
        .lineWidth(1)
        .moveTo(220, 258)
        .lineTo(220+140, 258)
        .stroke()
        .lineWidth(1)
        .moveTo(390, 258)
        .lineTo(390+140, 258)
        .stroke()
        .lineWidth(1)
        .moveTo(50, 298)
        .lineTo(50+140, 298)
        .stroke()
        .lineWidth(1)
        .moveTo(220, 298)
        .lineTo(220+140, 298)
        .stroke()
        .lineWidth(1)
        .moveTo(390, 298)
        .lineTo(390+140, 298)
        .stroke()
        .lineWidth(1)
        .moveTo(50, 338)
        .lineTo(50+140, 338)
        .stroke()
        .lineWidth(1)
        .moveTo(220, 338)
        .lineTo(220+140, 338)
        .stroke()
        .lineWidth(1)
        .moveTo(390, 338)
        .lineTo(390+140, 338)
        .stroke()
        .lineWidth(1)
        .moveTo(50, 378)
        .lineTo(50+140, 378)
        .stroke()
        .lineWidth(1)
        .moveTo(50, 390)
        .lineTo(550, 390)
        .stroke()

    doc.fillColor('#519164')
        .fontSize(16)
        .text("Frais obligatoire", 50, 420)
        if(devisData.services.length > 0 ) doc.text("Frais de service par réservation", 50, 500)
        .moveDown()
        
    doc.fillColor("black")
        .fontSize(12)
        .text("Abonnement annuel : 100 €", 70, 450)
        .text("Montant prélevé par nuit : "+ (devisData.prixNuit * 0.2).toFixed(2) + " €", 70, 470)
    

    let y = 500
    if(devisData.services.length > 0) {
        y += 30
        devisData.services.forEach((service) => {
            doc.text(service.nom + " " + service.prix.toFixed(2) + " €", 70, y)
            y += 20
        })
    }

    const totalString = "Montant total TTC : "

    doc.fillColor('#519164')
        .font("Helvetica-Bold")
        .text(totalString, 50, y + 10)
        .font("Helvetica")
        .text(String(devisData.total.toFixed(2)) + " €", (doc.widthOfString(totalString) + 60), y + 10)

    y += 15

    doc.end()

    return pdfPath
}