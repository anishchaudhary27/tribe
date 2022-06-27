package avatar

import (
	"context"
	"io/ioutil"
	"log"
	"time"

	"firebase.google.com/go/v4/storage"
	"github.com/gofiber/fiber/v2"
)

func HandleGetAvatar(ctx context.Context, storage *storage.Client) func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		bucket, err := storage.DefaultBucket()
		if err != nil {
			log.Println(err)
			return fiber.ErrInternalServerError
		}
		ctx, cancel := context.WithTimeout(ctx, time.Second*50)
		defer cancel()
		rc, err := bucket.Object("avatars/" + c.Params("id")).NewReader(ctx)
		if err != nil {
			log.Printf("Object(%q).NewReader: %v", "avatars/"+c.Params("id"), err)
			return c.SendFile("avatar.jpg")
		}
		defer rc.Close()
		data, err := ioutil.ReadAll(rc)
		if err != nil {
			log.Printf("ioutil.ReadAll: %v", err)
			return fiber.ErrInternalServerError
		}
		c.Response().Header.Set("Content-Type", "image")
		c.Response().Header.Set("Cache-Control", "public, max-age=300, s-maxage=600")
		return c.Send(data)
	}
}
