package main

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"

	"github.com/anishchaudhary27/tribe/backend/avatar"
	"github.com/anishchaudhary27/tribe/backend/middleware"
	"github.com/anishchaudhary27/tribe/backend/payment"
	"github.com/anishchaudhary27/tribe/backend/profile"
	"github.com/anishchaudhary27/tribe/backend/user"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/spf13/viper"
	"github.com/stripe/stripe-go/v72"
)

var firebaseConfig = &firebase.Config{
	StorageBucket: "tribe-a32a2.appspot.com",
}

type AppConfig struct {
	StripePrivateKey    string `mapstructure:"STRIPE_PRIVATE_KEY"`
	StripeWebhookSecret string `mapstructure:"STRIPE_WEBHOOK_SECRET"`
}

func main() {

	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		log.Fatal(err)
	}
	appConfig := &AppConfig{}
	if err := viper.Unmarshal(appConfig); err != nil {
		log.Fatal(err)
	}

	stripe.Key = appConfig.StripePrivateKey

	ctx := context.Background()
	firebaseApp, err := firebase.NewApp(ctx, firebaseConfig)
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
	storage, err := firebaseApp.Storage(ctx)
	if err != nil {
		log.Fatalf("error initializing firestore: %v\n", err)
	}

	app := fiber.New()
	app.Use(recover.New())
	app.Use(cors.New())
	app.Use(logger.New())
	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})
	app.Get("/avatar/:id", avatar.HandleGetAvatar(ctx, storage))
	app.Get("/profile/:id", profile.HandleGetProfile(ctx, firestore))

	app.Post("/payment/webhook", payment.HandleStripeWebhook(appConfig.StripeWebhookSecret))

	api := app.Group("/api")
	api.Use(middleware.AuthMiddleware(ctx, auth))
	userGroup := api.Group("/user")
	userGroup.Get("", user.HandleGetUser(ctx, firestore))
	userGroup.Post("/create", user.HandleCreateUser(ctx, firestore))
	userGroup.Post(("/update"), user.HandleUpdateUser(ctx, firestore))

	app.Listen(":8080")
}
