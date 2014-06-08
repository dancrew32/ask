import json
from optparse import make_option, OptionParser
import os
from subprocess import Popen, PIPE


class AskHandler(object):
    option_list = (
        make_option("-q", "--question", action="store", dest="question", help="Question to ask on Omegle"),
    )

    def __init__(self):
        self.parser = OptionParser(option_list=self.option_list)
        self.options, self.args = self.parser.parse_args()

    @property
    def command(self):
        ask_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'ask.js')
        phantom_path, err = Popen(['which', 'phantomjs'], stdin=PIPE, stdout=PIPE, stderr=PIPE).communicate()
        return [phantom_path.strip(), ask_path, '"%s"' % self.options.question]

    def run(self):
        if not self.options.question:
            raise QuestionError("You need to ask a question with -q or --question")
        out, err = Popen(self.command, stdin=PIPE, stdout=PIPE, stderr=PIPE).communicate()
        return out.strip()


class QuestionError(Exception):
    pass


if __name__ == "__main__":
    print
    ask = AskHandler()
    answers = json.loads(ask.run())
    if not answers:
        print("No answers, try again.")
    else:
        for answer in answers:
            print(answer)
