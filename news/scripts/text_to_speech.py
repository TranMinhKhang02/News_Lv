# from gtts import gTTS
# import sys
#
# text = sys.argv[1]
# output = sys.argv[2]
#
# tts = gTTS(text, lang='vi', tld='com.vn')
# tts.save(output)
from gtts import gTTS
from pydub import AudioSegment
import sys

def text_to_speech(text, output):
    # Tạo giọng nói sử dụng gTTS
    tts = gTTS(text, lang='vi', tld='com.vn')
    tts.save(output)

    # Tải tệp âm thanh đã tạo
    audio = AudioSegment.from_file(output)

    # Áp dụng chuẩn hóa để cải thiện chất lượng âm thanh
    normalized_audio = audio.normalize()

    # Áp dụng các hiệu ứng bổ sung (ví dụ: tăng âm lượng, thêm hiệu ứng reverb nhẹ)
    enhanced_audio = normalized_audio + 6  # Tăng âm lượng lên 6dB
    enhanced_audio = enhanced_audio.low_pass_filter(3000)  # Áp dụng bộ lọc thông thấp

    # Xuất âm thanh đã xử lý trở lại tệp
    enhanced_audio.export(output, format='mp3')

if __name__ == "__main__":
    text = sys.argv[1]
    output = sys.argv[2]
    text_to_speech(text, output)