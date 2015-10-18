package systests

import (
	"github.com/keybase/client/go/client"
	"github.com/keybase/client/go/service"
	"testing"
)

type testLoginUI struct{}

func TestSignup(t *testing.T) {

	tc := setupTest(t, "signup")

	defer tc.Cleanup()

	stopCh := make(chan error)
	svc := service.NewService(false, tc.G)
	startCh := svc.GetStartChannel()
	go func() {
		stopCh <- svc.Run()
	}()

	tc2 := cloneContext(tc)
	signup := client.NewCmdSignupRunner(g)

	<-startCh
	if err := stopper.Run(); err != nil {
		t.Fatal(err)
	}

	// If the server failed, it's also an error
	if err := <-stopCh; err != nil {
		t.Fatal(err)
	}
}
