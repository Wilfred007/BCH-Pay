class NotificationService {
    async sendEmail(to, subject, text) {
        // In a real app, use SendGrid or similar
        console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Content: ${text}`);
    }

    async sendSMS(to, message) {
        // In a real app, use Twilio or similar
        console.log(`[SMS] To: ${to} | Message: ${message}`);
    }

    async notifyInvoiceCreated(invoice, merchantEmail) {
        await this.sendEmail(
            merchantEmail,
            'New Invoice Created',
            `Invoice for ${invoice.amountFiat} ${invoice.currency} created. BCH Address: ${invoice.invoiceAddress}`
        );
    }

    async notifyPaymentReceived(invoice, merchantEmail) {
        await this.sendEmail(
            merchantEmail,
            'Payment Received',
            `Payment for invoice ${invoice._id} has been detected and is pending confirmation.`
        );
    }

    async notifySettlementCompleted(settlement, merchantEmail) {
        await this.sendEmail(
            merchantEmail,
            'Settlement Completed',
            `Settlement of ${settlement.stableAmount} ${settlement.currency} has been completed for your recent BCH payment.`
        );
    }
}

module.exports = new NotificationService();
