package user

import (
	"context"

	"cloud.google.com/go/firestore"
	"github.com/gofiber/fiber/v2"
	"google.golang.org/api/iterator"
)

func HandleGetUser(ctx context.Context, firestoreClient *firestore.Client) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		userDoc, err := firestoreClient.Collection("users").Doc(c.Locals("uid").(string)).Get(ctx)
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

func HandleCreateUser(ctx context.Context, firestoreClient *firestore.Client) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		body := CreateUserBody{}
		if err := c.BodyParser(&body); err != nil {
			return fiber.ErrBadRequest
		}
		iter := firestoreClient.Collection("users").Where("handle", "==", body.Handle).Documents(ctx)
		isUnique := true
		for {
			_, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return fiber.ErrInternalServerError
			}
			isUnique = false
		}
		if !isUnique {
			return c.Status(409).SendString("handle already taken")
		}
		newUser := User{}
		newUser.Name = body.Name
		newUser.Handle = body.Handle
		newUser.AnimateAvatar = true
		newUser.UID = c.Locals("uid").(string)
		_, err := firestoreClient.Collection("users").Doc(c.Locals("uid").(string)).Create(ctx, newUser)
		if err != nil {
			return fiber.ErrConflict
		}
		return c.JSON(newUser)
	}
}

type UpdateUserBody struct {
	Name          string `json:"name"`
	Handle        string `json:"handle"`
	About         string `json:"about"`
	Twitter       string `json:"twitter"`
	Instagram     string `json:"instagram"`
	Facebook      string `json:"facebook"`
	Youtube       string `json:"youtube"`
	AnimateAvatar bool   `json:"animateAvatar"`
}

func HandleUpdateUser(ctx context.Context, firestoreClient *firestore.Client) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		body := UpdateUserBody{}
		if err := c.BodyParser(&body); err != nil {
			return fiber.ErrBadRequest
		}
		_, err := firestoreClient.Collection("users").Doc(c.Locals("uid").(string)).Set(ctx, map[string]interface{}{
			"name":          body.Name,
			"about":         body.About,
			"facebook":      body.Facebook,
			"youtube":       body.Youtube,
			"instagram":     body.Instagram,
			"animateAvatar": body.AnimateAvatar,
		}, firestore.MergeAll)
		if err != nil {
			return fiber.ErrInternalServerError
		}
		userDoc, err := firestoreClient.Collection("users").Doc(c.Locals("uid").(string)).Get(ctx)
		if err != nil {
			return fiber.ErrNotFound
		}
		user := &User{}
		userDoc.DataTo(user)
		return c.JSON(user)
	}
}
