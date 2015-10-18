package client

import (
	"strings"

	"github.com/keybase/client/go/libkb"
)

type Field struct {
	Name        string
	Prompt      string
	FirstPrompt string
	Defval      string
	Hint        string
	Checker     *libkb.Checker
	Thrower     func(key, value string) error
	Disabled    bool
	Value       *string
}

func (f Field) GetValue() string {
	if f.Value == nil {
		return ""
	}
	return *f.Value
}

type Prompter interface {
	Run() error
}

type TerminalPrompter struct {
	Fields []*Field
}

var _ Prompter = (*TerminalPrompter)(nil)

func NewTerminalPrompter(f []*Field) Prompter {
	return &TerminalPrompter{f}
}

func (p *TerminalPrompter) Run() error {
	for _, f := range p.Fields {
		if f.Disabled {
			continue
		}
		if err := p.readField(f); err != nil {
			return err
		}
	}
	return nil
}

func (f *Field) Clear() string {
	old := f.GetValue()
	f.Value = nil
	return old
}

func (p *TerminalPrompter) readField(f *Field) (err error) {

	done := false
	first := true

	var val string

	term := GlobUI.Terminal
	if term == nil {
		return NoTerminalError{}
	}

	for !done && err == nil {

		prompt := f.Prompt
		if first {
			if len(f.FirstPrompt) > 0 {
				prompt += f.FirstPrompt
			}
			first = false
		} else {
			hint := f.Hint
			if len(hint) == 0 {
				hint = f.Checker.Hint
			}
			prompt += " (" + hint + ")"
		}

		var def string
		if len(f.Defval) > 0 {
			def = f.Defval
		} else if f.Value != nil {
			def = *f.Value
		}

		if len(def) > 0 {
			prompt += " [" + def + "]"
		}
		prompt += ": "

		if val, err = term.Prompt(prompt); err != nil {
			break
		}

		if len(val) == 0 && len(def) > 0 {
			val = def
		}

		if f.Checker == nil || !f.Checker.PreserveSpace {
			val = strings.TrimSpace(val)
		}

		if f.Thrower != nil {
			if err = f.Thrower(f.Name, val); err != nil {
				break
			}
		}
		if f.Checker != nil {
			done = f.Checker.F(val)
		} else {
			done = true
		}
		if done {
			f.Value = &val
		}
	}

	if err == nil {
		f.Value = &val
	}

	return
}
