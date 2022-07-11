package payment

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/stripe/stripe-go/v72/webhook"
)

func HandleStripeWebhook(StripeWebhookSecret string) func(c *fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		signatureHeader := c.GetReqHeaders()["Stripe-Signature"]
		event, err := webhook.ConstructEvent(c.Body(), signatureHeader, StripeWebhookSecret)
		if err != nil {
			log.Print("error while parsing stripe event: ", err)
			return c.SendStatus(fiber.StatusBadRequest)
		}
		switch event.Type {
		default:
			log.Print("unhandled event: ", event)
		}
		return c.SendStatus(fiber.StatusOK)
	}
}
