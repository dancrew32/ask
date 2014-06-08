# Ask

Ask a question to two strangers on Omegle and receive an array of responses in stdout.

## Example

### Input

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

### Output

If no one responds to your question, the script dies with an empty array `[]`.

If they do respond, it looks something like:

```bash
$ ask "What's your favorite brand of sneakers?"
["Stranger 1: wat are sneakers","Stranger 2: vans","Stranger 2: converse"]
```

## Install
```bash
sudo npm install -g phantomjs
git@github.com:dancrew32/ask.git
cd ask && phantomjs ask.js "What is the meaning of life?"
```

## Handling STDOUT

Just pipe this output into another script, 
parse as JSON, iterate and split with something like:

```javascript
/(?P<name>Stranger.+?):(?P<response>.*)/
```
