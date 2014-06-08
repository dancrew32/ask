# Ask

Ask a question to two strangers on Omegle and receive an array of responses in stdout.

## Example

```bash
phantomjs ask.js "What is your favorite color?"
```

or make a bash alias for it:

```bash
alias ask='phantomjs /path/to/ask.js'
```

then just

```bash
ask "What is your favorite color?"
```

## Notes

If no one responds to your question, the script dies with an empty array `[]`.

If they do respond, it looks something like:

```bash
$ ask "What's your favorite brand of sneakers?"
["Stranger 1: wat are sneakers","Stranger 2: vans","Stranger 2: converse"]
```

Just pipe this output into something else, 
parse JSON, iterate and split with `/(?P<name>Stranger.+?:)(?P<response>.*)/`
