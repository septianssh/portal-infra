package utils

import (
	"time"
)

// Backoff provides an exponential backoff strategy.
func Backoff(initial, max time.Duration) func() time.Duration {
	backoff := initial
	return func() time.Duration {
		b := backoff
		backoff *= 2
		if backoff > max {
			backoff = max
		}
		return b
	}
}
