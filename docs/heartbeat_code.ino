// =====================================================
// ESP32-C3 — Heart Rate + SpO2 + LCD + Buzzer
// Sensor : MAX30102 (PPG)
// Display: 16x2 I2C LCD (0x27)
// Buzzer : Active buzzer on GPIO 3
// I2C    : SDA=4, SCL=5
// Developer: Malaika Tauqeer | UMT Lahore
// Course : Instruments & Measurements
// =====================================================

#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include <LiquidCrystal_I2C.h>

// -------------------- Pins --------------------
#define I2C_SDA      4
#define I2C_SCL      5
#define BUZZER_PIN   3

// -------------------- LCD --------------------
LiquidCrystal_I2C lcd(0x27, 16, 2);

byte heartChar[8] = {
  0b00000, 0b01010, 0b11111,
  0b11111, 0b01110, 0b00100,
  0b00000, 0b00000
};

byte dropChar[8] = {
  0b00100, 0b00100, 0b01110,
  0b11111, 0b11111, 0b11111,
  0b01110, 0b00000
};

// -------------------- MAX30102 --------------------
#define BUFFER_SIZE  500
#define THRESHOLD    50000

MAX30105 particleSensor;
bool maxEnabled = false;

uint32_t irBuffer[BUFFER_SIZE];
uint32_t redBuffer[BUFFER_SIZE];
int headIndex    = 0;
int totalSamples = 0;
int sampleCounter= 0;
bool isFingerOnSensor = false;

// -------------------- Heart Rate --------------------
const byte RATE_SIZE = 10;
float rates[RATE_SIZE];
byte  rateSpot    = 0;
unsigned long lastBeatTime = 0;
float averageBpm  = -1.0f;

// -------------------- SpO2 --------------------
float latestSpo2  = -1.0f;

// -------------------- Frozen result --------------------
float displayBpm  = -1.0f;
float displaySpo2 = -1.0f;

// =====================================================
// LCD STATE MACHINE
// =====================================================
enum LcdState {
  LCD_IDLE,
  LCD_PROCESSING,
  LCD_BUZZING,
  LCD_RESULT,
  LCD_RESULT_HOLD
};

LcdState lcdState        = LCD_IDLE;
unsigned long stateStart = 0;
unsigned long lastLcdMillis  = 0;
const unsigned long LCD_INTERVAL = 400;

int  idleScrollPos = 0;
unsigned long lastScrollMillis = 0;
const unsigned long SCROLL_INTERVAL = 350;

uint8_t dotFrame = 0;

const unsigned long COLLECT_MS     = 7000;
const unsigned long RESULT_HOLD_MS = 5000;

// =====================================================
// SpO2 calculation
// =====================================================
float calculateSpO2(uint32_t *irData, uint32_t* redData, int len) {
  float irDC=0, redDC=0, irAC=0, redAC=0;
  for (int i=0;i<len;i++) { irDC+=irData[i]; redDC+=redData[i]; }
  irDC/=len; redDC/=len;
  for (int i=0;i<len;i++) {
    irAC  += abs((int32_t)(irData[i]  - irDC));
    redAC += abs((int32_t)(redData[i] - redDC));
  }
  irAC/=len; redAC/=len;
  if (irAC < 100 || redAC < 100) return -1.0f;
  float R = (redAC / redDC) / (irAC / irDC);
  float spo2 = -45.06f*R*R + 30.35f*R + 94.85f;
  if (spo2 > 100) spo2 = 100;
  if (spo2 < 70)  spo2 = 70;
  return spo2;
}

// =====================================================
// Buzzer — double beep
// =====================================================
void buzzerBeep() {
  digitalWrite(BUZZER_PIN, HIGH); delay(120);
  digitalWrite(BUZZER_PIN, LOW);  delay(80);
  digitalWrite(BUZZER_PIN, HIGH); delay(120);
  digitalWrite(BUZZER_PIN, LOW);
}

// =====================================================
// LCD DISPLAY
// =====================================================
void updateLCD(unsigned long now) {
  if (now - lastLcdMillis < LCD_INTERVAL) return;
  lastLcdMillis = now;

  switch (lcdState) {
    case LCD_IDLE: {
      const char* msg = "Check Heart Rate & O2  Place Finger on Sensor  ";
      int msgLen = strlen(msg);
      if (now - lastScrollMillis >= SCROLL_INTERVAL) {
        lastScrollMillis = now;
        idleScrollPos = (idleScrollPos + 1) % msgLen;
      }
      lcd.setCursor(0, 0);
      for (int i = 0; i < 16; i++)
        lcd.print(msg[(idleScrollPos + i) % msgLen]);
      lcd.setCursor(0, 1);
      lcd.print("Place finger    ");
      break;
    }

    case LCD_PROCESSING: {
      unsigned long elapsed = now - stateStart;
      int secsLeft = (int)((COLLECT_MS - elapsed) / 1000) + 1;
      if (secsLeft < 1) secsLeft = 1;
      lcd.setCursor(0, 0);
      lcd.print("Processing");
      dotFrame = (dotFrame + 1) % 4;
      for (int d = 0; d < 3; d++) lcd.print(d < (int)dotFrame ? '.' : ' ');
      lcd.print("   ");
      int barFilled = (int)(((float)elapsed / COLLECT_MS) * 10);
      if (barFilled > 10) barFilled = 10;
      lcd.setCursor(0, 1);
      lcd.print("[");
      for (int b = 0; b < 10; b++) lcd.print(b < barFilled ? '=' : ' ');
      lcd.print("] ");
      lcd.print(secsLeft);
      lcd.print("s ");
      break;
    }

    case LCD_BUZZING: {
      lcd.setCursor(0, 0);
      lcd.write(byte(0));
      lcd.print(" Done! Beep!    ");
      lcd.setCursor(0, 1);
      lcd.print("Remove Finger   ");
      break;
    }

    case LCD_RESULT:
    case LCD_RESULT_HOLD: {
      lcd.setCursor(0, 0);
      lcd.write(byte(0));
      lcd.print(" HR: ");
      if (displayBpm > 0) {
        lcd.print((int)displayBpm);
        lcd.print(" bpm   ");
      } else {
        lcd.print("--- bpm");
      }
      lcd.setCursor(0, 1);
      lcd.write(byte(1));
      lcd.print(" O2: ");
      if (displaySpo2 > 0) {
        lcd.print((int)displaySpo2);
        lcd.print("%  ");
        if      (displaySpo2 >= 95) lcd.print(" OK ");
        else if (displaySpo2 >= 90) lcd.print("LOW ");
        else                        lcd.print("!!! ");
      } else {
        lcd.print("---%      ");
      }
      break;
    }
  }
}

// =====================================================
// STATE TRANSITIONS
// =====================================================
void handleLcdState(unsigned long now) {
  switch (lcdState) {
    case LCD_IDLE:
      if (isFingerOnSensor) {
        lcdState   = LCD_PROCESSING;
        stateStart = now;
        dotFrame   = 0;
        lcd.clear();
      }
      break;

    case LCD_PROCESSING:
      if (!isFingerOnSensor) {
        lcdState      = LCD_IDLE;
        idleScrollPos = 0;
        lcd.clear();
        break;
      }
      if (now - stateStart >= COLLECT_MS) {
        displayBpm  = averageBpm;
        displaySpo2 = latestSpo2;
        lcdState    = LCD_BUZZING;
        stateStart  = now;
        lcd.clear();
        buzzerBeep();
      }
      break;

    case LCD_BUZZING:
      if (now - stateStart >= 1500) {
        lcdState   = LCD_RESULT;
        stateStart = now;
        lcd.clear();
      }
      break;

    case LCD_RESULT:
      if (!isFingerOnSensor) {
        lcdState   = LCD_RESULT_HOLD;
        stateStart = now;
      }
      break;

    case LCD_RESULT_HOLD:
      if (now - stateStart >= RESULT_HOLD_MS) {
        lcdState      = LCD_IDLE;
        idleScrollPos = 0;
        lcd.clear();
      }
      break;
  }
}

// =====================================================
// SETUP
// =====================================================
void setup() {
  Serial.begin(115200);
  Wire.begin(I2C_SDA, I2C_SCL, 400000);

  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  lcd.init();
  lcd.backlight();
  lcd.createChar(0, heartChar);
  lcd.createChar(1, dropChar);
  lcd.clear();
  lcd.setCursor(2, 0);
  lcd.print("Smart Shirt");
  lcd.setCursor(1, 1);
  lcd.print("Initializing...");

  if (particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    particleSensor.setup();
    particleSensor.setPulseAmplitudeRed(0x1F);
    particleSensor.setPulseAmplitudeIR (0x1F);
    maxEnabled = true;
  }

  for (int i = 0; i < RATE_SIZE; i++) rates[i] = 0.0f;
  delay(1200);
  lcd.clear();

  digitalWrite(BUZZER_PIN, HIGH); delay(60);
  digitalWrite(BUZZER_PIN, LOW);
}

// =====================================================
// MAIN LOOP
// =====================================================
void loop() {
  unsigned long curMillis = millis();

  if (maxEnabled) {
    particleSensor.check();
    while (particleSensor.available()) {
      uint32_t ir  = particleSensor.getFIFOIR();
      uint32_t red = particleSensor.getFIFORed();

      if (ir > THRESHOLD) {
        isFingerOnSensor = true;

        if (checkForBeat(ir)) {
          unsigned long delta = millis() - lastBeatTime;
          lastBeatTime = millis();
          float bpm = 60.0f / (delta / 1000.0f);
          if (bpm > 40.0f && bpm < 200.0f) {
            rates[rateSpot++] = bpm;
            rateSpot %= RATE_SIZE;
            float sum = 0; int cnt = 0;
            for (int i = 0; i < RATE_SIZE; i++)
              if (rates[i] > 0) { sum += rates[i]; cnt++; }
            if (cnt) averageBpm = sum / cnt;
          }
        }

        irBuffer[headIndex]  = ir;
        redBuffer[headIndex] = red;
        headIndex = (headIndex + 1) % BUFFER_SIZE;
        if (totalSamples < BUFFER_SIZE) totalSamples++;
        sampleCounter++;

        if (sampleCounter >= 100) {
          sampleCounter = 0;
          static uint32_t linearIR[BUFFER_SIZE];
          static uint32_t linearRed[BUFFER_SIZE];
          int cnt = totalSamples;
          for (int i = 0; i < cnt; i++) {
            int idx = (headIndex - cnt + i + BUFFER_SIZE) % BUFFER_SIZE;
            linearIR[i]  = irBuffer[idx];
            linearRed[i] = redBuffer[idx];
          }
          latestSpo2 = calculateSpO2(linearIR, linearRed, cnt);
        }

      } else {
        if (isFingerOnSensor) {
          isFingerOnSensor = false;
          latestSpo2 = -1.0f;
        }
        headIndex = 0; totalSamples = 0; sampleCounter = 0;
        averageBpm = -1.0f; lastBeatTime = 0; rateSpot = 0;
        for (int i = 0; i < RATE_SIZE; i++) rates[i] = 0.0f;
      }

      particleSensor.nextSample();
    }
  }

  handleLcdState(curMillis);
  updateLCD(curMillis);
}
