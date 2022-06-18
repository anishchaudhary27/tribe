package config

import (
	"testing"
)

func TestGetAppConfig(t *testing.T) {
	appConfig, err := GetAppConfig()
	t.Log(appConfig)
	if err != nil {
		t.Error(err)
	}
	if appConfig.Name == "anish" {
		t.Errorf("Got '%s'", appConfig.Name)
	}
}
