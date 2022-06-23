package user

import (
	"context"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
	"github.com/gofiber/fiber/v2"
)

func HandleGetUser(ctx context.Context, auth *auth.Client, firestore *firestore.Client) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		userDoc, err := firestore.Collection("users").Doc(c.Locals("uid").(string)).Get(ctx)
		if err != nil {
			return fiber.ErrNotFound
		}
		user := &User{}
		userDoc.DataTo(user)
		return c.JSON(user)
	}
}
