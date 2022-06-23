package main

import (
	"context"
	"fmt"
	"log"

	firebase "firebase.google.com/go/v4"

	"github.com/anishchaudhary27/tribe/backend/config"
	"github.com/anishchaudhary27/tribe/backend/middleware"
	"github.com/anishchaudhary27/tribe/backend/user"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	ctx := context.Background()
	firebaseApp, err := firebase.NewApp(ctx, nil)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
	auth, err := firebaseApp.Auth(ctx)
	if err != nil {
		log.Fatalf("error initializing auth: %v\n", err)
	}
	firestore, err := firebaseApp.Firestore(ctx)
	if err != nil {
		log.Fatalf("error initializing firestore: %v\n", err)
	}
	appConfig, err := config.GetAppConfig()
	if err != nil {
		panic(err)
	}
	fmt.Println(appConfig)
	app := fiber.New()
	app.Use(recover.New())
	app.Use(cors.New())
	app.Use(logger.New())
	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})
	api := app.Group("/api")
	api.Use(middleware.AuthMiddleware(ctx, auth))

	userGroup := api.Group("/user")

	userGroup.Get("", user.HandleGetUser(ctx, auth, firestore))

	app.Listen(":8080")
}
