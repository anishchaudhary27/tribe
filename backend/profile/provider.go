package profile

import (
	"context"

	"cloud.google.com/go/firestore"
	"github.com/gofiber/fiber/v2"
	"google.golang.org/api/iterator"
)

func HandleGetProfile(ctx context.Context, firestore *firestore.Client) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		itr := firestore.Collection("users").Where("handle", "==", c.Params("id")).Documents(ctx)
		profile := &Profile{}
		for {
			doc, err := itr.Next()
			if err == iterator.Done {
				return fiber.ErrNotFound
			}
			if err != nil {
				return fiber.ErrNotFound
			}
			doc.DataTo(profile)
			break
		}
		c.Response().Header.Set("Cache-Control", "public, max-age=300, s-maxage=600")
		return c.JSON(profile)
	}
}
