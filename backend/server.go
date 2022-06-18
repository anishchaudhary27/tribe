package main

import (
	"fmt"

	"github.com/anishchaudhary27/tribe/backend/config"
	"github.com/anishchaudhary27/tribe/backend/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
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
	api.Use(middleware.AuthMiddleware())

	// user := api.Group("/user")

	app.Listen(":8080")
}
