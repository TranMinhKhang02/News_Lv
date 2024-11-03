from gtts import gTTS
import sys

text = sys.argv[1]
output = sys.argv[2]

tts = gTTS(text, lang='vi')
tts.save(output)