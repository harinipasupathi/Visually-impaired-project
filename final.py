import cv2
import numpy as np
import pygame
import os
import time
from tflite_runtime.interpreter import Interpreter, load_delegate

# === CONFIGURATION ===
CURRENCY_MODEL_PATH = "/home/pi/Code/codes/model/converted_tflitecurr/model_unquant.tflite"
CURRENCY_LABELS_PATH = "/home/pi/Code/codes/model/converted_tflitecurr/labels.txt"
CURRENCY_AUDIO_DIR = "/home/pi/Code/codes/audio wav/curr"

OBJECT_MODEL_PATH = "/home/pi/Code/codes/model/converted_tfliteobj/model_unquant.tflite"
OBJECT_LABELS_PATH = "/home/pi/Code/codes/model/converted_tfliteobj/labels.txt"
OBJECT_AUDIO_DIR = "/home/pi/Code/codes/audio wav/obj"

# === Load labels ===
def load_labels(path):
    with open(path, 'r') as f:
        return [line.strip() for line in f.readlines()]

currency_labels = load_labels(CURRENCY_LABELS_PATH)
object_labels = load_labels(OBJECT_LABELS_PATH)

# === Load Edge TPU model ===
def load_interpreter(model_path):
    return Interpreter(model_path=model_path, experimental_delegates=[load_delegate('libedgetpu.so.1.0')])

currency_interpreter = load_interpreter(CURRENCY_MODEL_PATH)
currency_interpreter.allocate_tensors()

object_interpreter = load_interpreter(OBJECT_MODEL_PATH)
object_interpreter.allocate_tensors()

# === Get input shape ===
def get_input_details(interpreter):
    input_details = interpreter.get_input_details()
    shape = input_details[0]['shape']
    return input_details, interpreter.get_output_details(), shape

curr_input_details, curr_output_details, curr_shape = get_input_details(currency_interpreter)
obj_input_details, obj_output_details, obj_shape = get_input_details(object_interpreter)

# === Initialize Pygame for Audio ===
pygame.mixer.init()

# === Play Audio Function ===
def play_audio(file_path):
    try:
        if os.path.exists(file_path):
            pygame.mixer.music.load(file_path)
            pygame.mixer.music.play()
            while pygame.mixer.music.get_busy():
                time.sleep(0.1)
        else:
            print(f"Audio file not found: {file_path}")
    except Exception as e:
        print(f"Error playing audio: {e}")

# === Start Video Capture ===
cap = cv2.VideoCapture(0)  # USB Camera
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 320)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 240)

if not cap.isOpened():
    print("Error: Could not open camera.")
    exit()

print("System Ready. Press 'q' to quit.")

last_currency = ""
last_object = ""
frame_count = 0

try:
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        frame_count += 1
        if frame_count % 2 != 0:
            continue

        # Preprocess image for both models
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # === Currency Detection ===
        currency_img = cv2.resize(frame_rgb, (curr_shape[2], curr_shape[1]))
        currency_img = currency_img.astype('float32') / 255.0  # Convert to float32 and normalize
        currency_img = np.expand_dims(currency_img, axis=0)
        currency_interpreter.set_tensor(curr_input_details[0]['index'], currency_img)
        currency_interpreter.invoke()
        curr_output = currency_interpreter.get_tensor(curr_output_details[0]['index'])[0]
        curr_index = np.argmax(curr_output)
        curr_conf = curr_output[curr_index]
        curr_name = currency_labels[curr_index]

        # === Object Detection ===
        object_img = cv2.resize(frame_rgb, (obj_shape[2], obj_shape[1]))
        object_img = object_img.astype('float32') / 255.0  # Convert to float32 and normalize
        object_img = np.expand_dims(object_img, axis=0)
        object_interpreter.set_tensor(obj_input_details[0]['index'], object_img)
        object_interpreter.invoke()
        obj_output = object_interpreter.get_tensor(obj_output_details[0]['index'])[0]
        obj_index = np.argmax(obj_output)
        obj_conf = obj_output[obj_index]
        obj_name = object_labels[obj_index]

        # === Play Currency Audio ===
        if curr_conf > 0.9 and curr_name != last_currency:
            print(f"Currency: {curr_name} ({curr_conf:.2f})")
            audio_map = {
                "0 10": "10rupees.wav",
                "1 20": "20rupees.wav",
                "2 50": "50rupees.wav",
                "3 100": "100rupees.wav",
                "4 200": "200rupees.wav",
                "5 500": "500rupees.wav",
                "6 2000": "2000rupees.wav"
            }
            filename = audio_map.get(curr_name)
            if filename:
                play_audio(os.path.join(CURRENCY_AUDIO_DIR, filename))
            last_currency = curr_name

        # === Play Object Audio ===
        if obj_conf > 0.9 and obj_name != last_object:
            print(f"Object: {obj_name} ({obj_conf:.2f})")
            audio_map = {
                "0 Doors": "door.wav",
                "1 Windows": "windows.wav",
                "2 Cupboard": "cupboard.wav",
                "3 People": "people.wav",
                "5 Table": "Table.wav",
                "6 Chair": "chair.wav"
            }
            filename = audio_map.get(obj_name)
            if filename:
                play_audio(os.path.join(OBJECT_AUDIO_DIR, filename))
            last_object = obj_name

        # === Display Frame with Labels ===
        label_text = f"Currency: {curr_name} ({curr_conf:.2f}), Object: {obj_name} ({obj_conf:.2f})"
        cv2.putText(frame, label_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        cv2.imshow("Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

except KeyboardInterrupt:
    print("\nDetection stopped by user.")

cap.release()
cv2.destroyAllWindows()
pygame.mixer.quit()
