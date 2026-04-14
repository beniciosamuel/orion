"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = exports.EmailServiceError = void 0;
const resend_1 = require("resend");
const Secrets_1 = require("./Secrets");
class EmailServiceError extends Error {
    code;
    cause;
    constructor(message, code, cause) {
        super(message);
        this.code = code;
        this.cause = cause;
        this.name = "EmailServiceError";
    }
}
exports.EmailServiceError = EmailServiceError;
class EmailService {
    resendApiKey;
    resend;
    defaultFrom;
    constructor(args) {
        this.resendApiKey = args.resendApiKey;
        this.defaultFrom = args.defaultFrom;
        this.resend = new resend_1.Resend(args.resendApiKey);
    }
    static async initialize() {
        try {
            const secrets = new Secrets_1.Secrets();
            return new EmailService({
                resendApiKey: await secrets.getResendApiKey(),
                defaultFrom: "onboarding@resend.dev",
            });
        }
        catch (error) {
            if (error instanceof EmailServiceError) {
                throw error;
            }
            throw new EmailServiceError("Failed to initialize email service", "INITIALIZATION_FAILED", error instanceof Error ? error : new Error(String(error)));
        }
    }
    setDefaultFrom(from) {
        this.defaultFrom = from;
    }
    async sendEmail(to, subject, html, text) {
        return this.send({
            to,
            subject,
            html,
            text,
        });
    }
    async send(options) {
        if (!options.to || (Array.isArray(options.to) && options.to.length === 0)) {
            throw new EmailServiceError("Recipient email address is required", "INVALID_RECIPIENT");
        }
        if (!options.subject || options.subject.trim() === "") {
            throw new EmailServiceError("Email subject is required", "INVALID_SUBJECT");
        }
        if (!options.html || options.html.trim() === "") {
            throw new EmailServiceError("Email HTML content is required", "INVALID_CONTENT");
        }
        try {
            const { data, error } = await this.resend.emails.send({
                from: options.from || this.defaultFrom,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                replyTo: options.replyTo,
            });
            if (error) {
                console.error("Resend API error:", error);
                throw new EmailServiceError(error.message || "Failed to send email", "RESEND_API_ERROR");
            }
            if (!data?.id) {
                throw new EmailServiceError("No email ID returned from Resend", "NO_EMAIL_ID");
            }
            return {
                id: data.id,
                success: true,
            };
        }
        catch (error) {
            if (error instanceof EmailServiceError) {
                throw error;
            }
            throw new EmailServiceError("Failed to send email", "SEND_FAILED", error instanceof Error ? error : new Error(String(error)));
        }
    }
}
exports.EmailService = EmailService;
