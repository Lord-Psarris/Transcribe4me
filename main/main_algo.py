# importing libraries
import speech_recognition as sr
import os
from pydub import AudioSegment
from pydub.silence import split_on_silence, detect_nonsilent
from pydub.utils import make_chunks
import time
import shutil
import subprocess


def get_timestamp(seconds):
    complete_time = time.strftime("%H:%M:%S", time.gmtime(seconds))
    with_decimal = complete_time + '.' + str(round(seconds, 3)).split('.')[1]
    return with_decimal


# create a speech recognition object
r = sr.Recognizer()


# a function that splits the audio file into chunks
# and applies speech recognition
def get_subtitles(path, folder_name="audio-chunks"):
    """
    Splitting the large audio file into chunks
    and apply speech recognition on each of these chunks
    """
    # open the audio file using pydub
    sound = AudioSegment.from_wav(path)
    # split audio sound where silence is 700 miliseconds or more and get chunks
    chunks = split_on_silence(sound,
                              # experiment with this value for your target audio file
                              min_silence_len=500,
                              # adjust this per requirement
                              silence_thresh=sound.dBFS - 14,
                              # keep the silence for 1 second, adjustable as well
                              keep_silence=500,
                              )
    time_stamps = [[i / 1000, j / 1000] for i, j in
                   detect_nonsilent(sound, min_silence_len=500, silence_thresh=sound.dBFS - 14)]

    # create a directory to store the audio chunks
    if not os.path.isdir(folder_name):
        os.mkdir(folder_name)

    whole_text = ""
    count = 1

    # process each chunk
    for i, audio_chunk in enumerate(chunks, start=1): 
        # export audio chunk and save it in
        # the `folder_name` directory.
        chunk_filename = os.path.join(folder_name, f"chunk{i}.wav")
        audio_chunk.export(chunk_filename, format="wav")

        # recognize the chunk
        # ensure chunk length is not more than 5s
        file_length = int(audio_chunk.duration_seconds)
        if file_length > 6:
            sub_chunks = make_chunks(audio_chunk, 6000)

            # get current stamps
            current_start_stamp = time_stamps[i - 1][0]
            sub_folder_name = folder_name + '/sub_chunk'

            # create a directory to store the audio chunks
            if not os.path.isdir(sub_folder_name):
                os.mkdir(sub_folder_name)

            for j, sub_audio_chunk in enumerate(sub_chunks):

                sub_chunk_name = os.path.join(sub_folder_name, f"chunk{j}.wav")

                # export 5s audio chunk and save it in
                sub_audio_chunk.export(sub_chunk_name, format="wav")

                with sr.AudioFile(sub_chunk_name) as source:
                    r.adjust_for_ambient_noise(source)
                    audio_listened = r.record(source)
                    # try converting it to text
                    try:
                        text = r.recognize_google(audio_listened)
                    except sr.UnknownValueError:
                        print("(Unknown Statement)")
                    else:
                        text = f"{text.capitalize()}. "

                        current_end_stamp = current_start_stamp + sub_audio_chunk.duration_seconds

                        start = get_timestamp(current_start_stamp)
                        end = get_timestamp(current_end_stamp)

                        whole_text += f'{count}\n {start} --> {end} \n {text} \n\n'
                        count += 1
                        current_start_stamp = current_end_stamp
            shutil.rmtree(sub_folder_name)
        else:
            with sr.AudioFile(chunk_filename) as source:
                r.adjust_for_ambient_noise(source)
                audio_listened = r.record(source)
                # try converting it to text
                try:
                    text = r.recognize_google(audio_listened)
                except sr.UnknownValueError:
                    # pass
                    print("(Unknown Statement)")
                else:
                    text = f"{text.capitalize()}. "

                    start = get_timestamp(time_stamps[i - 1][0])
                    end = get_timestamp(time_stamps[i - 1][1])

                    whole_text += f'{count}\n {start} --> {end} \n {text} \n\n'
                    count += 1

    # return the text for all chunks detected and remove the directory
    shutil.rmtree(folder_name)
    return whole_text


def get_plain_text(path, folder_name="audio-chunks"):
    # open the audio file using pydub
    sound = AudioSegment.from_wav(path)
    # split audio sound where silence is 700 miliseconds or more and get chunks
    chunks = split_on_silence(sound,
                              # experiment with this value for your target audio file
                              min_silence_len=500,
                              # adjust this per requirement
                              silence_thresh=sound.dBFS - 14,
                              # keep the silence for 1 second, adjustable as well
                              keep_silence=500,
                              )
    # create a directory to store the audio chunks
    if not os.path.isdir(folder_name):
        os.mkdir(folder_name)
    whole_text = ""
    # process each chunk
    for i, audio_chunk in enumerate(chunks, start=1):
        # export audio chunk and save it in
        # the `folder_name` directory.
        chunk_filename = os.path.join(folder_name, f"chunk{i}.wav")
        audio_chunk.export(chunk_filename, format="wav")
        # recognize the chunk
        with sr.AudioFile(chunk_filename) as source:
            audio_listened = r.record(source)
            # try converting it to text
            try:
                text = r.recognize_google(audio_listened)
            except sr.UnknownValueError as e:
                print("Error:", str(e))
            else:
                text = f"{text.capitalize()}. "
                whole_text += text

    # return the text for all chunks detected
    shutil.rmtree(folder_name)
    return whole_text


def convert_to_wav(input_file, output_name):
    subprocess.call(['ffmpeg', '-i', input_file,
                     output_name])

# output_name = 'output.wav'
# convert_to_wav('movie.mp4', output_name)
# print(get_subtitles('output.wav'))
# print(get_plain_text('output.wav'))
