package config

import (
	"github.com/spf13/viper"
)

type AppConfig struct {
	Name string `mapstructure:"NAME"`
}

func GetAppConfig() (*AppConfig, error) {
	var appConfig AppConfig
	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		return &appConfig, err
	}
	if err := viper.Unmarshal(&appConfig); err != nil {
		return &appConfig, err
	}
	return &appConfig, nil
}
