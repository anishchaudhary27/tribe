package middleware

import (
	"context"

	"firebase.google.com/go/v4/auth"
	"github.com/gofiber/fiber/v2"
)

func AuthMiddleware(ctx context.Context, auth *auth.Client) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		token, err := auth.VerifyIDToken(ctx, c.GetReqHeaders()["X-Auth-Token"])
		if err != nil {
			return fiber.ErrForbidden
		}
		c.Locals("uid", token.UID)
		return c.Next()
	}
}
