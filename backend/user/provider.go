package user

import (
	"context"

	"cloud.google.com/go/firestore"
	"github.com/gofiber/fiber/v2"
)

func HandleGetUser(ctx context.Context, firestore *firestore.Client) func(*fiber.Ctx) error {
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

type CreateUserBody struct {
	Name   string `json:"name"`
	Handle string `json:"handle"`
}

func HandleCreateUser(ctx context.Context, firestore *firestore.Client) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		body := CreateUserBody{}
		if err := c.BodyParser(&body); err != nil {
			return fiber.ErrBadRequest
		}
		newUser := User{}
		newUser.Name = body.Name
		newUser.Handle = body.Handle
		_, err := firestore.Collection("users").Doc(c.Locals("uid").(string)).Create(ctx, newUser)
		if err != nil {
			return fiber.ErrConflict
		}
		return c.JSON(newUser)
	}
}
