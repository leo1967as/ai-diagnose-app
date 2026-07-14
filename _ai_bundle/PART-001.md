# PROJECT SNAPSHOT — PART 001/1
Generated: 2025-08-29 15:05:52
Instruction: อัปโหลด PART-* ตามลำดับ แล้วแจ้งว่า 'นี่คือโค้ดจากราก ./ ใช้ path หลังหัว FILE:'



--- FILE: .ai_bundle_cache.json ---

```json
{
  ".ai_bundle_cache.json": "ae63cb893e84ff09a69ad873b6ff657d10a9c8fb",
  "package-lock.json": "21621d32d88cace5c66ec46642cdbd59422bf450",
  "package.json": "39e16f87607d5c0e3d3922953a2ec803cbf6fc67",
  "server.js": "00bc35b24e1f7e85bbc302f014f6b412019d7a69",
  "vercel.json": "ea49759ff8a337f0f7531304ab51d35d52ca6c0b",
  "src\\api\\diagnosis.routes.js": "9cddc0e79ba58cdd4f68f3d562271920fb5ad1bb",
  "src\\config\\firebase.config.js": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  "src\\config\\gemini.config.js": "3b9f656037f21ebda0baded790355eb324e7e704",
  "src\\controllers\\diagnosis.controller.js": "d241507c6dc6324c1a8e6f9984266d5afd1735ac",
  "src\\middlewares\\errorHandler.middleware.js": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  "src\\repositories\\diagnosis.repository.js": "da39a3ee5e6b4b0d3255bfef95601890afd80709",
  "src\\services\\aiConnector.service.js": "323b13dcb98df49eab18c83b18fe7fcbe1892f57",
  "src\\services\\diagnosis.service.js": "eb41a5bb815ad288952fab6b983acc1e86bcf661",
  "src\\services\\gemini.config.js": "c2af7c1802b7e3ca2e00e88655dae60edcb52b55",
  "src\\utils\\logger.js": "da39a3ee5e6b4b0d3255bfef95601890afd80709"
}
```


--- FILE: .env ---

```
# .env

# Server Configuration
PORT=3000

# Firebase Configuration (Fill with your actual credentials)
FIREBASE_PROJECT_ID="composed-circle-301413"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# .env file
GEMINI_API_KEY="AIzaSyAURSdRGqa6jyPCxFHJbhQh0rVyz54s-ZA"
SEARCH_API_KEY="AIzaSyAqhbN0EwZX81dXBNQrzG3DQCymkPbWjzQ"
SEARCH_ENGINE_ID="c484bcce87c324831"

# --- Development Switch ---
# AI Provider Switch: "gemini" or "lmstudio"
AI_PROVIDER= "openrouter"
## local // gemini//openrouter

# LM Studio Configuration
LMSTUDIO_BASE_URL=http://localhost:1234/v1
LMSTUDIO_MODEL_NAME=google/gemma-3-1b # หรือชื่อโมเดลที่คุณโหลดใน LM Studio
# ข้อควรระวัง: สำหรับ PRIVATE_KEY ที่มีหลายบรรทัด ต้องครอบด้วย " และแทนที่การขึ้นบรรทัดใหม่ด้วย \n
LOCAL_AI_ENDPOINT="http://localhost:1234/v1/chat/completions"
OPENROUTER_MODEL = "google/gemini-2.5-flash"  # หรือชื่อโมเดลที่คุณต้องการใช้จาก OpenRouter
OPENROUTER_API_KEY = "your-openrouter-api-key"
```


--- FILE: .env example ---

```
# .env example

# Server Configuration
PORT=3000

# Firebase Configuration (Fill with your actual credentials)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-...@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# .env file
GEMINI_API_KEY=""
SEARCH_API_KEY=""
SEARCH_ENGINE_ID=""

ข้อควรระวัง: สำหรับ PRIVATE_KEY ที่มีหลายบรรทัด ต้องครอบด้วย " และแทนที่การขึ้นบรรทัดใหม่ด้วย \n

```


--- FILE: .gitignore ---

```
# .gitignore

# Dependencies
node_modules/

# Environment Variables
.env

Todo.txt
.vercel

```


--- FILE: AI_DIAGNOSIS_APP_FUNCTIONALITY.md ---

```markdown
# AI Diagnosis Application - Main Functionality Overview

## Introduction

The AI Diagnosis Application is a web-based health assessment tool designed to provide users with preliminary health analysis based on their symptoms and personal health information. The application leverages artificial intelligence to offer personalized health recommendations, risk assessments, and care suggestions.

This document provides a high-level overview of the application's main functionality, explaining how users interact with the system and how it processes information to generate health insights.

## User Interface and Interaction

The application features a user-friendly web interface that guides users through a comprehensive health assessment process:

1. **Health Profile Setup**: Users can create and save a personal health profile including:
   - Chronic conditions (diabetes, hypertension, allergies, etc.)
   - Drug allergies
   - Lifestyle factors (smoking, alcohol consumption)
   - Additional health notes

2. **Symptom Assessment Form**: The main interface presents users with a detailed form to describe their current health status:
   - Personal information (name, age, gender, weight, height)
   - Symptom selection from categorized lists (general, head/neck, respiratory, digestive)
   - Duration of symptoms
   - Recent meal information
   - Additional symptom details

3. **Two-Level Confirmation**: To prevent accidental submissions, the application implements a two-level confirmation process when submitting the health assessment form. When users first click the submit button, it changes to a confirmation state requiring a second click to actually submit the form.

4. **Profile Management**: Users can access and update their health profile through a dedicated settings panel.

## Data Processing Flow

The application follows a clear data processing flow to transform user input into actionable health insights:

1. **Data Collection**: The application gathers comprehensive health information from users through the web form.

2. **BMI Calculation**: The system automatically calculates the user's Body Mass Index (BMI) based on their height and weight inputs.

3. **Data Preparation**: All collected information is formatted and prepared for AI analysis.

4. **AI Analysis Request**: The prepared data is sent to the backend service for AI processing.

5. **AI Analysis**: The application utilizes Google's Gemini AI model to analyze the health data and generate personalized recommendations.

6. **Result Formatting**: The AI's analysis is structured into a user-friendly format.

7. **Result Presentation**: The formatted results are displayed to the user through the web interface.

## AI Analysis Component

The core of the application is its AI analysis engine powered by Google's Gemini AI:

1. **Contextual Analysis**: The AI considers all provided information including symptoms, personal health profile, BMI, and recent meals.

2. **Risk Assessment**: The system evaluates potential health risks based on the user's profile and symptoms.

3. **Personalized Recommendations**: The AI generates customized health advice considering the user's specific circumstances.

4. **Error Handling**: The system includes retry mechanisms to ensure reliable AI communication.

## Results Presentation

Users receive comprehensive health insights through a structured results display:

1. **Primary Assessment**: A summary analysis connecting symptoms with personal health factors.

2. **Risk Evaluation**: Categorized risk assessment with explanations of how personal factors influence each risk.

3. **Care Recommendations**: 
   - Immediate actions to take
   - General wellness advice
   - Activity guidance (recommended and to avoid)

4. **Dietary Suggestions**: 
   - Nutritional concepts tailored to the user's condition
   - Recommended foods by category
   - Foods to avoid with explanations

5. **Warning Signs**: Important red flags users should monitor.

6. **Important Disclaimers**: Clear statements about the limitations of AI analysis and the importance of professional medical consultation.

## Key Benefits

- **Personalized Health Insights**: Tailored recommendations based on individual health profiles
- **Comprehensive Assessment**: Considers multiple health factors beyond just symptoms
- **User-Friendly Interface**: Intuitive design that makes health assessment accessible
- **Privacy Focused**: Health profiles are stored locally on the user's device
- **Educational Value**: Helps users understand potential health connections and considerations

## Conclusion

The AI Diagnosis Application provides an accessible way for individuals to gain preliminary insights into their health status. By combining user-provided information with AI analysis, it offers personalized recommendations that can help users make informed decisions about their health and wellness. The application emphasizes that its assessments are supplementary tools and not replacements for professional medical diagnosis.
```


--- FILE: TWO_LEVEL_CONFIRMATION_PLAN.md ---

```markdown
# Two-Level Confirmation Implementation Plan

## Overview
This document outlines the implementation plan for adding a two-level confirmation to the submit button in the AI Diagnosis Application. This feature will help prevent accidental submissions of the health assessment form.

## Current Implementation
The current form submission process works as follows:
1. User fills out the health assessment form
2. User clicks the "ส่งข้อมูลเพื่อวิเคราะห์" (Submit for Analysis) button
3. Form data is validated client-side
4. If validation passes, data is sent to the backend for AI analysis

## Proposed Implementation
The two-level confirmation will work as follows:
1. User fills out the health assessment form
2. User clicks the "ส่งข้อมูลเพื่อวิเคราะห์" button
3. Button text changes to "ยืนยันการส่งข้อมูล" (Confirm Submission) and color changes to indicate the need for confirmation
4. If user clicks the button again within a specified time period (e.g., 3 seconds), the form is submitted
5. If user does not click the button again within the time period, it reverts to the original state

## Technical Implementation Details

### HTML Changes
- Modify the submit button to support dual states
- Add a data attribute to track the confirmation state

### JavaScript Changes
- Modify the event listener for the form submission
- Add logic to handle the two-level confirmation:
  1. First click: Change button state and start a timer
  2. Second click: Submit the form
  3. Timeout: Revert button to original state

### CSS Changes
- Add styles for the confirmation state of the button
- Add visual feedback for the confirmation state

## Implementation Steps

### Step 1: Update HTML
- Modify the submit button element to support dual states
- Add necessary data attributes

### Step 2: Update CSS
- Add styles for the confirmation state
- Add transition effects for visual feedback

### Step 3: Update JavaScript
- Modify the form submission event listener
- Implement the two-level confirmation logic
- Add timer functionality
- Handle edge cases (form validation, timeout, etc.)

## Edge Cases to Consider
1. User clicks the button once and then navigates away
2. User clicks the button once and then modifies form data
3. Form validation fails on the second click
4. User clicks the button multiple times rapidly
5. Accessibility considerations for screen readers

## Testing Plan
1. Verify the first click changes the button state
2. Verify the second click within the time period submits the form
3. Verify the button reverts to original state after timeout
4. Verify form validation still works correctly
5. Verify the feature works on both desktop and mobile devices
6. Verify accessibility considerations are met

## Code Implementation Example

### HTML
```html
<button type="submit" class="main-button" id="submit-button" data-confirm="false">ส่งข้อมูลเพื่อวิเคราะห์</button>
```

### CSS
```css
.main-button[data-confirm="true"] {
    background-color: #ff6b6b; /* Different color for confirmation state */
    transform: scale(1.05); /* Slight scale effect for visual feedback */
}

.main-button[data-confirm="true"]::after {
    content: " (คลิกอีกครั้งเพื่อยืนยัน)";
    font-size: 0.8em;
    display: block;
}
```

### JavaScript
```javascript
const submitButton = document.getElementById('submit-button');
let confirmTimeout;

submitButton.addEventListener('click', function(e) {
    if (submitButton.dataset.confirm === "false") {
        e.preventDefault();
        
        // Change button state
        submitButton.dataset.confirm = "true";
        submitButton.textContent = "ยืนยันการส่งข้อมูล";
        
        // Set timeout to revert state
        confirmTimeout = setTimeout(() => {
            submitButton.dataset.confirm = "false";
            submitButton.textContent = "ส่งข้อมูลเพื่อวิเคราะห์";
        }, 3000); // 3 seconds timeout
    } else {
        // Clear timeout since user confirmed
        clearTimeout(confirmTimeout);
        
        // Allow form submission to proceed
        // The form submission will be handled by the existing event listener
    }
});
```

## Integration with Existing Code
The implementation will integrate with the existing form submission logic in `public/js/app.js`. The two-level confirmation will be an additional layer that works before the existing validation and submission process.

## Accessibility Considerations
1. Ensure screen readers announce the state changes
2. Add ARIA attributes to indicate the button state
3. Ensure keyboard navigation works correctly
4. Consider users with cognitive disabilities who might be confused by the two-step process

## Performance Considerations
1. The implementation should not significantly impact page load time
2. The timeout mechanism should be efficient
3. Memory leaks from timers should be avoided
```


--- FILE: Todo.txt ---

```
กลุ่มที่ 1: การวิเคราะห์เชิงลึกและเฉพาะบุคคล (Hyper-Personalization)
1. โปรไฟล์สุขภาพเชิงลึก:
ไอเดีย: เพิ่มหน้า "โปรไฟล์สุขภาพของฉัน" ให้ผู้ใช้กรอกข้อมูลสำคัญแบบสมัครใจ เช่น โรคประจำตัว (เบาหวาน, ความดัน, ภูมิแพ้), ยาที่แพ้, ประวัติการผ่าตัด, การสูบบุหรี่/ดื่มแอลกอฮอล์
การอัปเกรด: AI จะนำข้อมูลนี้มาวิเคราะห์ร่วมด้วย ทำให้คำแนะนำฉลาดขึ้นแบบก้าวกระโดด เช่น "จากอาการเจ็บคอ และการที่คุณเป็นโรคเบาหวาน ควรระวังการติดเชื้อมากกว่าคนทั่วไป" หรือ "ยาไอบูโพรเฟนที่คุณมี อาจไม่เหมาะกับผู้ที่มีประวัติโรคกระเพาะ"
2. ระบบบันทึกและติดตามอาการ (Symptom Diary & Tracker):
ไอเดีย: แทนที่จะประเมินครั้งเดียวจบ, ให้มีปุ่ม "บันทึกและติดตามอาการ" หลังได้รับผล ผู้ใช้สามารถกลับมาอัปเดตอาการได้ทุกวัน (เช่น "วันนี้ไอน้อยลงแต่ยังเจ็บคออยู่")
การอัปเกรด: แอปจะแสดงผลเป็นกราฟแนวโน้มของอาการ และในการประเมินครั้งถัดไป AI จะเห็นประวัติทั้งหมด ทำให้สามารถวิเคราะห์อาการเรื้อรังหรืออาการที่เปลี่ยนแปลงไปตามกาลเวลาได้
3. การวิเคราะห์ภาพถ่าย (Visual Analysis):
ไอเดีย: เพิ่มปุ่ม "อัปโหลดรูปภาพ" ให้ผู้ใช้สามารถถ่ายรูปสิ่งผิดปกติที่มองเห็นได้ เช่น ผื่นตามผิวหนัง, ลักษณะของแผล, สีของเสมหะ, หรือลักษณะลิ้น
การอัปเกรด: เราจะใช้โมเดล Gemini เวอร์ชันที่รองรับ multimodal (รับทั้งข้อความและรูปภาพ) ส่งรูปภาพไปพร้อมกับ Prompt แล้วสั่งให้ AI วิเคราะห์ "จากภาพผื่นที่มีลักษณะเป็นตุ่มน้ำใสๆ และกระจายเป็นกลุ่ม ประกอบกับอาการไข้ อาจมีความเกี่ยวข้องกับ..." (นี่เป็นฟีเจอร์ระดับสูงและทรงพลังมาก)
กลุ่มที่ 2: การให้ข้อมูลเชิงรุกและสร้างความน่าเชื่อถือ (Proactive & Trust-Building)
4. ระบบแนะนำบทความสุขภาพที่เกี่ยวข้อง:
ไอเดีย: หลังจากแสดงผลการวิเคราะห์ AI จะดึง "บทความสุขภาพที่น่าเชื่อถือ" ซึ่งเกี่ยวข้องกับภาวะที่อาจเป็น มาแสดงต่อท้าย
การอัปเกรด: เราจะสั่งให้ AI สร้างคีย์เวิร์ดการค้นหา (เช่น "วิธีแก้ไอ, อาหารสำหรับคนเจ็บคอ") แล้วอาจจะใช้ Google Search API (หรือลิงก์ไปยังเว็บโรงพยาบาลที่น่าเชื่อถือ) เพื่อดึงบทความมาแสดงให้ผู้ใช้อ่านต่อเพื่อความเข้าใจที่ลึกซึ้งขึ้น
5. อธิบาย "ทำไม" AI ถึงคิดแบบนั้น (Explainable AI - XAI):
ไอเดีย: เพิ่มปุ่มไอคอน (?) เล็กๆ ข้างๆ "ภาวะที่อาจเกี่ยวข้อง" แต่ละข้อ เมื่อผู้ใช้กด จะมี Pop-up อธิบายว่า "AI ประเมินว่าคุณอาจมีความเสี่ยงต่อภาวะนี้ โดยพิจารณาจาก 3 ปัจจัยหลักที่คุณแจ้งมาคือ: 1. อาการไอ (บ่งชี้การระคายเคืองทางเดินหายใจ), 2. ระยะเวลาที่เป็นมา 3 วัน (บ่งชี้การติดเชื้อเฉียบพลัน), 3. อาการปวดเมื่อยตามตัว (เป็นอาการร่วมที่พบบ่อยของไข้หวัดใหญ่)"
การอัปเกรด: ช่วยสร้างความโปร่งใสและความน่าเชื่อถือ ผู้ใช้จะเข้าใจว่า AI ไม่ได้ "เดา" แต่มีกระบวนการคิดที่เป็นเหตุเป็นผล
```


--- FILE: package-lock.json ---

```json
{
  "name": "ai-diagnose-app",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "dependencies": {
        "@google/generative-ai": "^0.24.1",
        "cors": "^2.8.5",
        "dotenv": "^17.2.0",
        "express": "^5.1.0"
      }
    },
    "node_modules/@google/generative-ai": {
      "version": "0.24.1",
      "resolved": "https://registry.npmjs.org/@google/generative-ai/-/generative-ai-0.24.1.tgz",
      "integrity": "sha512-MqO+MLfM6kjxcKoy0p1wRzG3b4ZZXtPI+z2IE26UogS2Cm/XHO+7gGRBh6gcJsOiIVoH93UwKvW4HdgiOZCy9Q==",
      "license": "Apache-2.0",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/accepts": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/accepts/-/accepts-2.0.0.tgz",
      "integrity": "sha512-5cvg6CtKwfgdmVqY1WIiXKc3Q1bkRqGLi+2W/6ao+6Y7gu/RCwRuAhGEzh5B4KlszSuTLgZYuqFqo5bImjNKng==",
      "license": "MIT",
      "dependencies": {
        "mime-types": "^3.0.0",
        "negotiator": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/body-parser": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/body-parser/-/body-parser-2.2.0.tgz",
      "integrity": "sha512-02qvAaxv8tp7fBa/mw1ga98OGm+eCbqzJOKoRt70sLmfEEi+jyBYVTDGfCL/k06/4EMk/z01gCe7HoCH/f2LTg==",
      "license": "MIT",
      "dependencies": {
        "bytes": "^3.1.2",
        "content-type": "^1.0.5",
        "debug": "^4.4.0",
        "http-errors": "^2.0.0",
        "iconv-lite": "^0.6.3",
        "on-finished": "^2.4.1",
        "qs": "^6.14.0",
        "raw-body": "^3.0.0",
        "type-is": "^2.0.0"
      },
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/bytes": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/bytes/-/bytes-3.1.2.tgz",
      "integrity": "sha512-/Nf7TyzTx6S3yRJObOAV7956r8cr2+Oj8AC5dt8wSP3BQAoeX58NoHyCU8P8zGkNXStjTSi6fzO6F0pBdcYbEg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/call-bind-apply-helpers": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/call-bind-apply-helpers/-/call-bind-apply-helpers-1.0.2.tgz",
      "integrity": "sha512-Sp1ablJ0ivDkSzjcaJdxEunN5/XvksFJ2sMBFfq6x0ryhQV/2b/KwFe21cMpmHtPOSij8K99/wSfoEuTObmuMQ==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/call-bound": {
      "version": "1.0.4",
      "resolved": "https://registry.npmjs.org/call-bound/-/call-bound-1.0.4.tgz",
      "integrity": "sha512-+ys997U96po4Kx/ABpBCqhA9EuxJaQWDQg7295H4hBphv3IZg0boBKuwYpt4YXp6MZ5AmZQnU/tyMTlRpaSejg==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "get-intrinsic": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/content-disposition": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/content-disposition/-/content-disposition-1.0.0.tgz",
      "integrity": "sha512-Au9nRL8VNUut/XSzbQA38+M78dzP4D+eqg3gfJHMIHHYa3bg067xj1KxMUWj+VULbiZMowKngFFbKczUrNJ1mg==",
      "license": "MIT",
      "dependencies": {
        "safe-buffer": "5.2.1"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/content-type": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/content-type/-/content-type-1.0.5.tgz",
      "integrity": "sha512-nTjqfcBFEipKdXCv4YDQWCfmcLZKm81ldF0pAopTvyrFGVbcR6P/VAAd5G7N+0tTr8QqiU0tFadD6FK4NtJwOA==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie": {
      "version": "0.7.2",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-0.7.2.tgz",
      "integrity": "sha512-yki5XnKuf750l50uGTllt6kKILY4nQ1eNIQatoXEByZ5dWgnKqbnqmTrBE5B4N7lrMJKQ2ytWMiTO2o0v6Ew/w==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/cookie-signature": {
      "version": "1.2.2",
      "resolved": "https://registry.npmjs.org/cookie-signature/-/cookie-signature-1.2.2.tgz",
      "integrity": "sha512-D76uU73ulSXrD1UXF4KE2TMxVVwhsnCgfAyTg9k8P6KGZjlXKrOLe4dJQKI3Bxi5wjesZoFXJWElNWBjPZMbhg==",
      "license": "MIT",
      "engines": {
        "node": ">=6.6.0"
      }
    },
    "node_modules/cors": {
      "version": "2.8.5",
      "resolved": "https://registry.npmjs.org/cors/-/cors-2.8.5.tgz",
      "integrity": "sha512-KIHbLJqu73RGr/hnbrO9uBeixNGuvSQjul/jdFvS/KFSIH1hWVd1ng7zOHx+YrEfInLG7q4n6GHQ9cDtxv/P6g==",
      "license": "MIT",
      "dependencies": {
        "object-assign": "^4",
        "vary": "^1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/debug": {
      "version": "4.4.1",
      "resolved": "https://registry.npmjs.org/debug/-/debug-4.4.1.tgz",
      "integrity": "sha512-KcKCqiftBJcZr++7ykoDIEwSa3XWowTfNPo92BYxjXiyYEVrUQh2aLyhxBCwww+heortUFxEJYcRzosstTEBYQ==",
      "license": "MIT",
      "dependencies": {
        "ms": "^2.1.3"
      },
      "engines": {
        "node": ">=6.0"
      },
      "peerDependenciesMeta": {
        "supports-color": {
          "optional": true
        }
      }
    },
    "node_modules/depd": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/depd/-/depd-2.0.0.tgz",
      "integrity": "sha512-g7nH6P6dyDioJogAAGprGpCtVImJhpPk/roCzdb3fIh61/s/nPsfR6onyMwkCAR/OlC3yBC0lESvUoQEAssIrw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/dotenv": {
      "version": "17.2.0",
      "resolved": "https://registry.npmjs.org/dotenv/-/dotenv-17.2.0.tgz",
      "integrity": "sha512-Q4sgBT60gzd0BB0lSyYD3xM4YxrXA9y4uBDof1JNYGzOXrQdQ6yX+7XIAqoFOGQFOTK1D3Hts5OllpxMDZFONQ==",
      "license": "BSD-2-Clause",
      "engines": {
        "node": ">=12"
      },
      "funding": {
        "url": "https://dotenvx.com"
      }
    },
    "node_modules/dunder-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/dunder-proto/-/dunder-proto-1.0.1.tgz",
      "integrity": "sha512-KIN/nDJBQRcXw0MLVhZE9iQHmG68qAVIBg9CqmUYjmQIhgij9U5MFvrqkUL5FbtyyzZuOeOt0zdeRe4UY7ct+A==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.1",
        "es-errors": "^1.3.0",
        "gopd": "^1.2.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/ee-first": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/ee-first/-/ee-first-1.1.1.tgz",
      "integrity": "sha512-WMwm9LhRUo+WUaRN+vRuETqG89IgZphVSNkdFgeb6sS/E4OrDIN7t48CAewSHXc6C8lefD8KKfr5vY61brQlow==",
      "license": "MIT"
    },
    "node_modules/encodeurl": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/encodeurl/-/encodeurl-2.0.0.tgz",
      "integrity": "sha512-Q0n9HRi4m6JuGIV1eFlmvJB7ZEVxu93IrMyiMsGC0lrMJMWzRgx6WGquyfQgZVb31vhGgXnfmPNNXmxnOkRBrg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/es-define-property": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/es-define-property/-/es-define-property-1.0.1.tgz",
      "integrity": "sha512-e3nRfgfUZ4rNGL232gUgX06QNyyez04KdjFrF+LTRoOXmrOgFKDg4BCdsjW8EnT69eqdYGmRpJwiPVYNrCaW3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-errors": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/es-errors/-/es-errors-1.3.0.tgz",
      "integrity": "sha512-Zf5H2Kxt2xjTvbJvP2ZWLEICxA6j+hAmMzIlypy4xcBg1vKVnx89Wy0GbS+kf5cwCVFFzdCFh2XSCFNULS6csw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/es-object-atoms": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/es-object-atoms/-/es-object-atoms-1.1.1.tgz",
      "integrity": "sha512-FGgH2h8zKNim9ljj7dankFPcICIK9Cp5bm+c2gQSYePhpaG5+esrLODihIorn+Pe6FGJzWhXQotPv73jTaldXA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/escape-html": {
      "version": "1.0.3",
      "resolved": "https://registry.npmjs.org/escape-html/-/escape-html-1.0.3.tgz",
      "integrity": "sha512-NiSupZ4OeuGwr68lGIeym/ksIZMJodUGOSCZ/FSnTxcrekbvqrgdUxlJOMpijaKZVjAJrWrGs/6Jy8OMuyj9ow==",
      "license": "MIT"
    },
    "node_modules/etag": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/etag/-/etag-1.8.1.tgz",
      "integrity": "sha512-aIL5Fx7mawVa300al2BnEE4iNvo1qETxLrPI/o05L7z6go7fCw1J6EQmbK4FmJ2AS7kgVF/KEZWufBfdClMcPg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/express": {
      "version": "5.1.0",
      "resolved": "https://registry.npmjs.org/express/-/express-5.1.0.tgz",
      "integrity": "sha512-DT9ck5YIRU+8GYzzU5kT3eHGA5iL+1Zd0EutOmTE9Dtk+Tvuzd23VBU+ec7HPNSTxXYO55gPV/hq4pSBJDjFpA==",
      "license": "MIT",
      "dependencies": {
        "accepts": "^2.0.0",
        "body-parser": "^2.2.0",
        "content-disposition": "^1.0.0",
        "content-type": "^1.0.5",
        "cookie": "^0.7.1",
        "cookie-signature": "^1.2.1",
        "debug": "^4.4.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "finalhandler": "^2.1.0",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.0",
        "merge-descriptors": "^2.0.0",
        "mime-types": "^3.0.0",
        "on-finished": "^2.4.1",
        "once": "^1.4.0",
        "parseurl": "^1.3.3",
        "proxy-addr": "^2.0.7",
        "qs": "^6.14.0",
        "range-parser": "^1.2.1",
        "router": "^2.2.0",
        "send": "^1.1.0",
        "serve-static": "^2.2.0",
        "statuses": "^2.0.1",
        "type-is": "^2.0.1",
        "vary": "^1.1.2"
      },
      "engines": {
        "node": ">= 18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/finalhandler": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/finalhandler/-/finalhandler-2.1.0.tgz",
      "integrity": "sha512-/t88Ty3d5JWQbWYgaOGCCYfXRwV1+be02WqYYlL6h0lEiUAMPM8o8qKGO01YIkOHzka2up08wvgYD0mDiI+q3Q==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "on-finished": "^2.4.1",
        "parseurl": "^1.3.3",
        "statuses": "^2.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/forwarded": {
      "version": "0.2.0",
      "resolved": "https://registry.npmjs.org/forwarded/-/forwarded-0.2.0.tgz",
      "integrity": "sha512-buRG0fpBtRHSTCOASe6hD258tEubFoRLb4ZNA6NxMVHNw2gOcwHo9wyablzMzOA5z9xA9L1KNjk/Nt6MT9aYow==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/fresh": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/fresh/-/fresh-2.0.0.tgz",
      "integrity": "sha512-Rx/WycZ60HOaqLKAi6cHRKKI7zxWbJ31MhntmtwMoaTeF7XFH9hhBp8vITaMidfljRQ6eYWCKkaTK+ykVJHP2A==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/function-bind": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/function-bind/-/function-bind-1.1.2.tgz",
      "integrity": "sha512-7XHNxH7qX9xG5mIwxkhumTox/MIRNcOgDrxWsMt2pAr23WHp6MrRlN7FBSFpCpr+oVO0F744iUgR82nJMfG2SA==",
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-intrinsic": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/get-intrinsic/-/get-intrinsic-1.3.0.tgz",
      "integrity": "sha512-9fSjSaos/fRIVIp+xSJlE6lfwhES7LNtKaCBIamHsjr2na1BiABJPo0mOjjz8GJDURarmCPGqaiVg5mfjb98CQ==",
      "license": "MIT",
      "dependencies": {
        "call-bind-apply-helpers": "^1.0.2",
        "es-define-property": "^1.0.1",
        "es-errors": "^1.3.0",
        "es-object-atoms": "^1.1.1",
        "function-bind": "^1.1.2",
        "get-proto": "^1.0.1",
        "gopd": "^1.2.0",
        "has-symbols": "^1.1.0",
        "hasown": "^2.0.2",
        "math-intrinsics": "^1.1.0"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/get-proto": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/get-proto/-/get-proto-1.0.1.tgz",
      "integrity": "sha512-sTSfBjoXBp89JvIKIefqw7U2CCebsc74kiY6awiGogKtoSGbgjYE/G/+l9sF3MWFPNc9IcoOC4ODfKHfxFmp0g==",
      "license": "MIT",
      "dependencies": {
        "dunder-proto": "^1.0.1",
        "es-object-atoms": "^1.0.0"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/gopd": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/gopd/-/gopd-1.2.0.tgz",
      "integrity": "sha512-ZUKRh6/kUFoAiTAtTYPZJ3hw9wNxx+BIBOijnlG9PnrJsCcSjs1wyyD6vJpaYtgnzDrKYRSqf3OO6Rfa93xsRg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/has-symbols": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/has-symbols/-/has-symbols-1.1.0.tgz",
      "integrity": "sha512-1cDNdwJ2Jaohmb3sg4OmKaMBwuC48sYni5HUw2DvsC8LjGTLK9h+eb1X6RyuOHe4hT0ULCW68iomhjUoKUqlPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/hasown": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/hasown/-/hasown-2.0.2.tgz",
      "integrity": "sha512-0hJU9SCPvmMzIBdZFqNPXWa6dqh7WdH0cII9y+CyS8rG3nL48Bclra9HmKhVVUHyPWNH5Y7xDwAB7bfgSjkUMQ==",
      "license": "MIT",
      "dependencies": {
        "function-bind": "^1.1.2"
      },
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/http-errors": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/http-errors/-/http-errors-2.0.0.tgz",
      "integrity": "sha512-FtwrG/euBzaEjYeRqOgly7G0qviiXoJWnvEH2Z1plBdXgbyjv34pHTSb9zoeHMyDy33+DWy5Wt9Wo+TURtOYSQ==",
      "license": "MIT",
      "dependencies": {
        "depd": "2.0.0",
        "inherits": "2.0.4",
        "setprototypeof": "1.2.0",
        "statuses": "2.0.1",
        "toidentifier": "1.0.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/http-errors/node_modules/statuses": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.1.tgz",
      "integrity": "sha512-RwNA9Z/7PrK06rYLIzFMlaF+l73iwpzsqRIFgbMLbTcLD6cOao82TaWefPXQvB2fOC4AjuYSEndS7N/mTCbkdQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/iconv-lite": {
      "version": "0.6.3",
      "resolved": "https://registry.npmjs.org/iconv-lite/-/iconv-lite-0.6.3.tgz",
      "integrity": "sha512-4fCk79wshMdzMp2rH06qWrJE4iolqLhCUH+OiuIgU++RB0+94NlDL81atO7GX55uUKueo0txHNtvEyI6D7WdMw==",
      "license": "MIT",
      "dependencies": {
        "safer-buffer": ">= 2.1.2 < 3.0.0"
      },
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/inherits": {
      "version": "2.0.4",
      "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.4.tgz",
      "integrity": "sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==",
      "license": "ISC"
    },
    "node_modules/ipaddr.js": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/ipaddr.js/-/ipaddr.js-1.9.1.tgz",
      "integrity": "sha512-0KI/607xoxSToH7GjN1FfSbLoU0+btTicjsQSWQlh/hZykN8KpmMf7uYwPW3R+akZ6R/w18ZlXSHBYXiYUPO3g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/is-promise": {
      "version": "4.0.0",
      "resolved": "https://registry.npmjs.org/is-promise/-/is-promise-4.0.0.tgz",
      "integrity": "sha512-hvpoI6korhJMnej285dSg6nu1+e6uxs7zG3BYAm5byqDsgJNWwxzM6z6iZiAgQR4TJ30JmBTOwqZUw3WlyH3AQ==",
      "license": "MIT"
    },
    "node_modules/math-intrinsics": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/math-intrinsics/-/math-intrinsics-1.1.0.tgz",
      "integrity": "sha512-/IXtbwEk5HTPyEwyKX6hGkYXxM9nbj64B+ilVJnC/R6B0pH5G4V3b0pVbL7DBj4tkhBAppbQUlf6F6Xl9LHu1g==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      }
    },
    "node_modules/media-typer": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/media-typer/-/media-typer-1.1.0.tgz",
      "integrity": "sha512-aisnrDP4GNe06UcKFnV5bfMNPBUw4jsLGaWwWfnH3v02GnBuXX2MCVn5RbrWo0j3pczUilYblq7fQ7Nw2t5XKw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/merge-descriptors": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/merge-descriptors/-/merge-descriptors-2.0.0.tgz",
      "integrity": "sha512-Snk314V5ayFLhp3fkUREub6WtjBfPdCPY1Ln8/8munuLuiYhsABgBVWsozAG+MWMbVEvcdcpbi9R7ww22l9Q3g==",
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sponsors/sindresorhus"
      }
    },
    "node_modules/mime-db": {
      "version": "1.54.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.54.0.tgz",
      "integrity": "sha512-aU5EJuIN2WDemCcAp2vFBfp/m4EAhWJnUNSSw0ixs7/kXbd6Pg64EmwJkNdFhB8aWt1sH2CTXrLxo/iAGV3oPQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/mime-types": {
      "version": "3.0.1",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-3.0.1.tgz",
      "integrity": "sha512-xRc4oEhT6eaBpU1XF7AjpOFD+xQmXNB5OVKwp4tqCuBpHLS/ZbBDrc07mYTDqVMg6PfxUjjNp85O6Cd2Z/5HWA==",
      "license": "MIT",
      "dependencies": {
        "mime-db": "^1.54.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/ms": {
      "version": "2.1.3",
      "resolved": "https://registry.npmjs.org/ms/-/ms-2.1.3.tgz",
      "integrity": "sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==",
      "license": "MIT"
    },
    "node_modules/negotiator": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/negotiator/-/negotiator-1.0.0.tgz",
      "integrity": "sha512-8Ofs/AUQh8MaEcrlq5xOX0CQ9ypTF5dl78mjlMNfOK08fzpgTHQRQPBxcPlEtIw0yRpws+Zo/3r+5WRby7u3Gg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/object-assign": {
      "version": "4.1.1",
      "resolved": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
      "integrity": "sha512-rJgTQnkUnH1sFw8yT6VSU3zD3sWmu6sZhIseY8VX+GRu3P6F7Fu+JNDoXfklElbLJSnc3FUQHVe4cU5hj+BcUg==",
      "license": "MIT",
      "engines": {
        "node": ">=0.10.0"
      }
    },
    "node_modules/object-inspect": {
      "version": "1.13.4",
      "resolved": "https://registry.npmjs.org/object-inspect/-/object-inspect-1.13.4.tgz",
      "integrity": "sha512-W67iLl4J2EXEGTbfeHCffrjDfitvLANg0UlX3wFUUSTx92KXRFegMHUVgSqE+wvhAbi4WqjGg9czysTV2Epbew==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/on-finished": {
      "version": "2.4.1",
      "resolved": "https://registry.npmjs.org/on-finished/-/on-finished-2.4.1.tgz",
      "integrity": "sha512-oVlzkg3ENAhCk2zdv7IJwd/QUD4z2RxRwpkcGY8psCVcCYZNq4wYnVWALHM+brtuJjePWiYF/ClmuDr8Ch5+kg==",
      "license": "MIT",
      "dependencies": {
        "ee-first": "1.1.1"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/once": {
      "version": "1.4.0",
      "resolved": "https://registry.npmjs.org/once/-/once-1.4.0.tgz",
      "integrity": "sha512-lNaJgI+2Q5URQBkccEKHTQOPaXdUxnZZElQTZY0MFUAuaEqe1E+Nyvgdz/aIyNi6Z9MzO5dv1H8n58/GELp3+w==",
      "license": "ISC",
      "dependencies": {
        "wrappy": "1"
      }
    },
    "node_modules/parseurl": {
      "version": "1.3.3",
      "resolved": "https://registry.npmjs.org/parseurl/-/parseurl-1.3.3.tgz",
      "integrity": "sha512-CiyeOxFT/JZyN5m0z9PfXw4SCBJ6Sygz1Dpl0wqjlhDEGGBP1GnsUVEL0p63hoG1fcj3fHynXi9NYO4nWOL+qQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/path-to-regexp": {
      "version": "8.2.0",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-8.2.0.tgz",
      "integrity": "sha512-TdrF7fW9Rphjq4RjrW0Kp2AW0Ahwu9sRGTkS6bvDi0SCwZlEZYmcfDbEsTz8RVk0EHIS/Vd1bv3JhG+1xZuAyQ==",
      "license": "MIT",
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/proxy-addr": {
      "version": "2.0.7",
      "resolved": "https://registry.npmjs.org/proxy-addr/-/proxy-addr-2.0.7.tgz",
      "integrity": "sha512-llQsMLSUDUPT44jdrU/O37qlnifitDP+ZwrmmZcoSKyLKvtZxpyV0n2/bD/N4tBAAZ/gJEdZU7KMraoK1+XYAg==",
      "license": "MIT",
      "dependencies": {
        "forwarded": "0.2.0",
        "ipaddr.js": "1.9.1"
      },
      "engines": {
        "node": ">= 0.10"
      }
    },
    "node_modules/qs": {
      "version": "6.14.0",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.14.0.tgz",
      "integrity": "sha512-YWWTjgABSKcvs/nWBi9PycY/JiPJqOD4JA6o9Sej2AtvSGarXxKC3OQSk4pAarbdQlKAh5D4FCQkJNkW+GAn3w==",
      "license": "BSD-3-Clause",
      "dependencies": {
        "side-channel": "^1.1.0"
      },
      "engines": {
        "node": ">=0.6"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/range-parser": {
      "version": "1.2.1",
      "resolved": "https://registry.npmjs.org/range-parser/-/range-parser-1.2.1.tgz",
      "integrity": "sha512-Hrgsx+orqoygnmhFbKaHE6c296J+HTAQXoxEF6gNupROmmGJRoyzfG3ccAveqCBrwr/2yxQ5BVd/GTl5agOwSg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/raw-body": {
      "version": "3.0.0",
      "resolved": "https://registry.npmjs.org/raw-body/-/raw-body-3.0.0.tgz",
      "integrity": "sha512-RmkhL8CAyCRPXCE28MMH0z2PNWQBNk2Q09ZdxM9IOOXwxwZbN+qbWaatPkdkWIKL2ZVDImrN/pK5HTRz2PcS4g==",
      "license": "MIT",
      "dependencies": {
        "bytes": "3.1.2",
        "http-errors": "2.0.0",
        "iconv-lite": "0.6.3",
        "unpipe": "1.0.0"
      },
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/router": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/router/-/router-2.2.0.tgz",
      "integrity": "sha512-nLTrUKm2UyiL7rlhapu/Zl45FwNgkZGaCpZbIHajDYgwlJCOzLSk+cIPAnsEqV955GjILJnKbdQC1nVPz+gAYQ==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.4.0",
        "depd": "^2.0.0",
        "is-promise": "^4.0.0",
        "parseurl": "^1.3.3",
        "path-to-regexp": "^8.0.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/safe-buffer": {
      "version": "5.2.1",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.1.tgz",
      "integrity": "sha512-rp3So07KcdmmKbGvgaNxQSJr7bGVSVk5S9Eq1F+ppbRo70+YeaDxkw5Dd8NPN+GD6bjnYm2VuPuCXmpuYvmCXQ==",
      "funding": [
        {
          "type": "github",
          "url": "https://github.com/sponsors/feross"
        },
        {
          "type": "patreon",
          "url": "https://www.patreon.com/feross"
        },
        {
          "type": "consulting",
          "url": "https://feross.org/support"
        }
      ],
      "license": "MIT"
    },
    "node_modules/safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==",
      "license": "MIT"
    },
    "node_modules/send": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/send/-/send-1.2.0.tgz",
      "integrity": "sha512-uaW0WwXKpL9blXE2o0bRhoL2EGXIrZxQ2ZQ4mgcfoBxdFmQold+qWsD2jLrfZ0trjKL6vOw0j//eAwcALFjKSw==",
      "license": "MIT",
      "dependencies": {
        "debug": "^4.3.5",
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "etag": "^1.8.1",
        "fresh": "^2.0.0",
        "http-errors": "^2.0.0",
        "mime-types": "^3.0.1",
        "ms": "^2.1.3",
        "on-finished": "^2.4.1",
        "range-parser": "^1.2.1",
        "statuses": "^2.0.1"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/serve-static": {
      "version": "2.2.0",
      "resolved": "https://registry.npmjs.org/serve-static/-/serve-static-2.2.0.tgz",
      "integrity": "sha512-61g9pCh0Vnh7IutZjtLGGpTA355+OPn2TyDv/6ivP2h/AdAVX9azsoxmg2/M6nZeQZNYBEwIcsne1mJd9oQItQ==",
      "license": "MIT",
      "dependencies": {
        "encodeurl": "^2.0.0",
        "escape-html": "^1.0.3",
        "parseurl": "^1.3.3",
        "send": "^1.2.0"
      },
      "engines": {
        "node": ">= 18"
      }
    },
    "node_modules/setprototypeof": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/setprototypeof/-/setprototypeof-1.2.0.tgz",
      "integrity": "sha512-E5LDX7Wrp85Kil5bhZv46j8jOeboKq5JMmYM3gVGdGH8xFpPWXUMsNrlODCrkoxMEeNi/XZIwuRvY4XNwYMJpw==",
      "license": "ISC"
    },
    "node_modules/side-channel": {
      "version": "1.1.0",
      "resolved": "https://registry.npmjs.org/side-channel/-/side-channel-1.1.0.tgz",
      "integrity": "sha512-ZX99e6tRweoUXqR+VBrslhda51Nh5MTQwou5tnUDgbtyM0dBgmhEDtWGP/xbKn6hqfPRHujUNwz5fy/wbbhnpw==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.3",
        "side-channel-list": "^1.0.0",
        "side-channel-map": "^1.0.1",
        "side-channel-weakmap": "^1.0.2"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-list": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/side-channel-list/-/side-channel-list-1.0.0.tgz",
      "integrity": "sha512-FCLHtRD/gnpCiCHEiJLOwdmFP+wzCmDEkc9y7NsYxeF4u7Btsn1ZuwgwJGxImImHicJArLP4R0yX4c2KCrMrTA==",
      "license": "MIT",
      "dependencies": {
        "es-errors": "^1.3.0",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-map": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/side-channel-map/-/side-channel-map-1.0.1.tgz",
      "integrity": "sha512-VCjCNfgMsby3tTdo02nbjtM/ewra6jPHmpThenkTYh8pG9ucZ/1P8So4u4FGBek/BjpOVsDCMoLA/iuBKIFXRA==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/side-channel-weakmap": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/side-channel-weakmap/-/side-channel-weakmap-1.0.2.tgz",
      "integrity": "sha512-WPS/HvHQTYnHisLo9McqBHOJk2FkHO/tlpvldyrnem4aeQp4hai3gythswg6p01oSoTl58rcpiFAjF2br2Ak2A==",
      "license": "MIT",
      "dependencies": {
        "call-bound": "^1.0.2",
        "es-errors": "^1.3.0",
        "get-intrinsic": "^1.2.5",
        "object-inspect": "^1.13.3",
        "side-channel-map": "^1.0.1"
      },
      "engines": {
        "node": ">= 0.4"
      },
      "funding": {
        "url": "https://github.com/sponsors/ljharb"
      }
    },
    "node_modules/statuses": {
      "version": "2.0.2",
      "resolved": "https://registry.npmjs.org/statuses/-/statuses-2.0.2.tgz",
      "integrity": "sha512-DvEy55V3DB7uknRo+4iOGT5fP1slR8wQohVdknigZPMpMstaKJQWhwiYBACJE3Ul2pTnATihhBYnRhZQHGBiRw==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/toidentifier": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/toidentifier/-/toidentifier-1.0.1.tgz",
      "integrity": "sha512-o5sSPKEkg/DIQNmH43V0/uerLrpzVedkUh8tGNvaeXpfpuwjKenlSox/2O/BTlZUtEe+JG7s5YhEz608PlAHRA==",
      "license": "MIT",
      "engines": {
        "node": ">=0.6"
      }
    },
    "node_modules/type-is": {
      "version": "2.0.1",
      "resolved": "https://registry.npmjs.org/type-is/-/type-is-2.0.1.tgz",
      "integrity": "sha512-OZs6gsjF4vMp32qrCbiVSkrFmXtG/AZhY3t0iAMrMBiAZyV9oALtXO8hsrHbMXF9x6L3grlFuwW2oAz7cav+Gw==",
      "license": "MIT",
      "dependencies": {
        "content-type": "^1.0.5",
        "media-typer": "^1.1.0",
        "mime-types": "^3.0.0"
      },
      "engines": {
        "node": ">= 0.6"
      }
    },
    "node_modules/unpipe": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/unpipe/-/unpipe-1.0.0.tgz",
      "integrity": "sha512-pjy2bYhSsufwWlKwPc+l3cN7+wuJlK6uz0YdJEOlQDbl6jo/YlPi4mb8agUkVC8BF7V8NuzeyPNqRksA3hztKQ==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/vary": {
      "version": "1.1.2",
      "resolved": "https://registry.npmjs.org/vary/-/vary-1.1.2.tgz",
      "integrity": "sha512-BNGbWLfd0eUPabhkXUVm0j8uuvREyTh5ovRa/dyow/BqAbZJyC+5fU+IzQOzmAKzYqYRAISoRhdQr3eIZ/PXqg==",
      "license": "MIT",
      "engines": {
        "node": ">= 0.8"
      }
    },
    "node_modules/wrappy": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz",
      "integrity": "sha512-l4Sp/DRseor9wL6EvV2+TuQn63dMkPjZ/sp9XkghTEbV9KlPS1xUsZ3u7/IQO4wxtcFB4bgpQPRcR3QCvezPcQ==",
      "license": "ISC"
    }
  }
}

```


--- FILE: package.json ---

```json
{
  "name": "ai-diagnose-app",
  "version": "1.0.0",
  "description": "AI-assisted initial diagnosis application",
  "main": "server.js",
  "type": "module",  
  "scripts": {
    "start": "node server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "ai",
    "diagnosis",
    "gemini"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@google/generative-ai": "^0.24.1",
    "cors": "^2.8.5",
    "dotenv": "^17.2.0",
    "express": "^5.1.0"
  }
}
```


--- FILE: server.js ---

```javascript
// File: server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import diagnosisRoutes from './src/api/diagnosis.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middlewares ---

// Define the allowed origin
const corsOptions = {
  // origin: 'https://ai-medic-mockup.vercel.app'
  origin: 'http://127.0.0.1:5500/' // สำหรับการพัฒนาในเครื่อง
};

// Use the cors middleware with the specific options
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));

// --- API Routes ---
app.use('/api', diagnosisRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Note: If you are using ES Modules (import/export), you should use 'export default app;'
// instead of 'module.exports = app;'. However, based on your imports, the current structure seems fine.
export default app; // Or stick with module.exports if you have a reason for it.
```


--- FILE: src/api/diagnosis.routes.js ---

```javascript
// File: src/api/diagnosis.routes.js
import express from 'express';
import diagnosisController from '../controllers/diagnosis.controller.js';

const router = express.Router();

router.post('/assess', diagnosisController.handleAssessmentRequest);

export default router;
```


--- FILE: src/config/firebase.config.js ---

```javascript

```


--- FILE: src/config/gemini.config.js ---

```javascript
// File: src/config/gemini.config.js
import 'dotenv/config'; // Make sure environment variables are loaded
import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment Check - Fail fast if key is missing
if (!process.env.GEMINI_API_KEY) {
    throw new Error("FATAL ERROR: GEMINI_API_KEY is not defined in your .env file.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create a specific model instance for our diagnosis task
const diagnosisModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { response_mime_type: "application/json" }
});

export { diagnosisModel };
```


--- FILE: src/controllers/diagnosis.controller.js ---

```javascript
// File: src/controllers/diagnosis.controller.js
import diagnosisService from '../services/diagnosis.service.js';

// เปลี่ยนชื่อฟังก์ชันให้สื่อความหมายมากขึ้น
async function handleAssessmentRequest(req, res, next) {
    try {
        const userData = req.body;
        
        // --- Validation ---
        const { name, age, sex, weight, height, symptoms } = userData;
        if (!name || !age || !sex || !weight || !height || !symptoms) {
            // ส่ง status 400 (Bad Request) ซึ่งเหมาะสมกว่า 500
            return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน", details: "กรุณากรอกข้อมูล: name, age, sex, weight, height, symptoms ให้ครบถ้วน" });
        }

        console.log(`[Controller] ได้รับคำขอจาก: ${name}, เริ่มส่งต่อไปยัง Service...`);

        // เรียกใช้ Service และส่งข้อมูลทั้งหมดไปในครั้งเดียว
        // สังเกตว่า Controller ไม่รู้เลยว่าเบื้องหลังมีการคำนวณ BMI หรือ Retry อย่างไร
        const assessmentResult = await diagnosisService.getAiAssessment(userData);

        // ส่งผลลัพธ์ที่ได้จาก Service กลับไปให้ Client
        res.status(200).json(assessmentResult);

    } catch (error) {
        console.error("[Controller] เกิดข้อผิดพลาดรุนแรง:", error);
        // ในอนาคต เราจะใช้ next(error) เพื่อส่งไปให้ Middleware จัดการ
        // แต่ตอนนี้ส่ง 500 กลับไปก่อน
        res.status(500).json({
            error: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
            details: error.message || "ไม่สามารถระบุสาเหตุได้"
        });
    }
}

export default { handleAssessmentRequest };

// // src/controllers/diagnosis.controller.js
// const diagnosisService = require('../services/diagnosis.service');

// async function getDiagnosis(req, res, next) {
//     try {
//         const userData = req.body;
//         // TODO: เพิ่มการ Validation ข้อมูลที่รับเข้ามา (สำคัญมากในงานจริง)
        
//         const result = await diagnosisService.performDiagnosis(userData);

//         res.status(200).json(result);
//     } catch (error) {
//         // TODO: ส่ง error ไปให้ error handling middleware
//         console.error(error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }

// module.exports = { getDiagnosis };
```


--- FILE: src/middlewares/errorHandler.middleware.js ---

```javascript

```


--- FILE: src/repositories/diagnosis.repository.js ---

```javascript

```


--- FILE: src/services/aiConnector.service.js ---

```javascript
// File: src/services/aiConnector.service.js
import 'dotenv/config';
import { diagnosisModel } from '../config/gemini.config.js';

/**
 * ฟังก์ชันสำหรับเรียกใช้ Google Gemini AI
 * @param {string} prompt - Prompt ที่จะส่งให้ AI
 * @returns {Promise<string>} - ผลลัพธ์ที่ได้จาก AI ในรูปแบบ JSON string
 */
async function generateWithGemini(prompt) {
    console.log("🔌 [Connector] กำลังส่งคำขอไปยัง Google Gemini AI...");
    const result = await diagnosisModel.generateContent(prompt);
    return result.response.text();
}

/**
 * ฟังก์ชันสำหรับเรียกใช้ Local LLM ที่มี API แบบ OpenAI
 * @param {string} prompt - Prompt ที่จะส่งให้ AI
 * @returns {Promise<string>} - ผลลัพธ์ที่ได้จาก AI ในรูปแบบ JSON string
 */
async function generateWithLocalLM(prompt) {
    console.log(`🔌 [Connector] กำลังส่งคำขอไปยัง Local LLM ที่: ${process.env.LOCAL_AI_ENDPOINT}`);
    
    const systemPrompt = `**บทบาทและเป้าหมาย (Role and Goal):** คุณคือ AI ที่ปรึกษาด้านสุขภาพเชิงวิเคราะห์ (Analytical Wellness Advisor) เป้าหมายเดียวของคุณคือการนำ "ข้อมูลทั้งหมด" ที่ให้มา ไปสร้างการวิเคราะห์ที่เชื่อมโยงกันอย่างสมเหตุสมผลและปลอดภัย สร้างผลลัพธ์เป็น JSON object ที่สมบูรณ์ตามโครงสร้างที่กำหนดเท่านั้น`;
    const userPrompt = prompt;

    const body = {
        model: "openai/gpt-oss-20b",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.4,
        max_tokens: -1,
        stream: false
    };

    try {
        const response = await fetch(process.env.LOCAL_AI_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Local AI API request failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        console.log("🔍 [Connector] Full JSON response from Local LLM:", JSON.stringify(data, null, 2));

        // --- จุดที่แก้ไขให้ถูกต้อง ---
        // ตรวจสอบโครงสร้างข้อมูลที่ได้รับกลับมาให้ถูกต้องตาม Log ที่เห็น
        if (data.choices && data.choices[0] && data.choices[0].message && typeof data.choices[0].message.content === 'string') {
            
            const rawContent = data.choices[0].message.content;
            console.log("📄 [Connector] ได้รับ Raw response จาก Local LLM:\n", rawContent);

            // ใช้ Regex เพื่อดึงเฉพาะส่วนที่เป็น JSON ออกมา
            const jsonMatch = rawContent.match(/{[\s\S]*}/);

            if (jsonMatch && jsonMatch[0]) {
                console.log("✅ [Connector] ดึงข้อมูล JSON จาก Raw response สำเร็จ");
                return jsonMatch[0]; // คืนค่า String ของ JSON ที่สะอาดแล้ว
            } else {
                console.error("❌ [Connector] ไม่พบข้อมูล JSON ในการตอบกลับจาก Local LLM");
                throw new Error("Could not find a valid JSON object in the Local LLM response.");
            }
        } else {
            // ถ้าโครงสร้างไม่ถูกต้อง ให้โยน Error
            throw new Error("Invalid response structure from Local AI API");
        }
        // --- สิ้นสุดจุดที่แก้ไข ---

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ Local LLM:", error);
        throw error;
    }
}


/**
 * ฟังก์ชันสำหรับเรียกใช้ AI Model ผ่าน OpenRouter
 * @param {string} prompt - Prompt ที่จะส่งให้ AI
 * @returns {Promise<string>} - ผลลัพธ์ที่ได้จาก AI ในรูปแบบ JSON string
 */
async function generateWithOpenRouter(prompt) {
    const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
    console.log(`🔌 [Connector] กำลังส่งคำขอไปยัง OpenRouter...`);

    const systemPrompt = `**บทบาทและเป้าหมาย (Role and Goal):** ...`; // Prompt เดิมของคุณ
    const userPrompt = prompt;

    const body = {
        // --- สำคัญ: เลือกโมเดลที่ต้องการใช้จาก OpenRouter ---
        // ดูรายชื่อโมเดลทั้งหมดได้ที่ https://openrouter.ai/models
        model: "google/gemini-2.5-flash", // ตัวอย่าง: ใช้ Llama 3 8B (ฟรี)
        // model: "mistralai/mixtral-8x7b-instruct", // ตัวอย่าง: Mixtral (ฟรี)
        // model: "openai/gpt-4o", // ตัวอย่าง: GPT-4o (เสียเงิน)
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        temperature: 0.5,
        // OpenRouter บางโมเดลรองรับการบังคับ JSON โดยตรง
        // response_format: { "type": "json_object" } 
    };

    try {
        const response = await fetch(OPENROUTER_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // --- สำคัญ: เพิ่ม Authorization Header ---
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                // Header แนะนำโดย OpenRouter เพื่อระบุแอปของคุณ
                'HTTP-Referer': `http://localhost:${process.env.PORT}`, 
                'X-Title': `AI Diagnose App`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`OpenRouter API request failed with status ${response.status}: ${errorBody}`);
        }

        const data = await response.json();
        // โครงสร้าง Response เหมือนกับ OpenAI เป๊ะๆ โค้ดเดิมใช้ได้เลย
        if (data.choices && data.choices[0] && data.choices[0].message && typeof data.choices[0].message.content === 'string') {
            const rawContent = data.choices[0].message.content;
            const jsonMatch = rawContent.match(/{[\s\S]*}/);
            if (jsonMatch && jsonMatch[0]) {
                return jsonMatch[0];
            } else {
                throw new Error("Could not find a valid JSON object in the OpenRouter response.");
            }
        } else {
            throw new Error("Invalid response structure from OpenRouter API");
        }

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเชื่อมต่อ OpenRouter:", error);
        throw error;
    }
}

/**
 * ฟังก์ชันหลักที่จะถูกเรียกจากภายนอก ทำหน้าที่เป็นตัวกลาง
 * @param {string} prompt - Prompt ที่จะส่งให้ AI
 * @returns {Promise<string>}
 */
async function generateContent(prompt) {
    const provider = process.env.AI_PROVIDER || 'gemini';

     if (provider === 'openrouter') { // <--- เพิ่มเงื่อนไขนี้
        return generateWithOpenRouter(prompt);
    } else if (provider === 'local') {
        return generateWithLocalLM(prompt);
    } else if (provider === 'gemini') {
        return generateWithGemini(prompt);
    } else {
        throw new Error(`AI Provider ที่ระบุไม่ถูกต้อง: "${provider}".`);
    }
}

export default { generateContent };
```


--- FILE: src/services/diagnosis.service.js ---

```javascript
// src/services/diagnosis.service.js
// File: src/services/diagnosis.service.js
// import { diagnosisModel } from '../config/gemini.config.js'; // ลบบรรทัดนี้
import aiConnector from './aiConnector.service.js'; // เพิ่มบรรทัดนี้

// --- Helper Function: Calculate BMI (ไม่มีการแก้ไข) ---
const calculateBMI = (weight, height) => {
    if (!weight || !height || height <= 0) return { value: 0, category: 'ข้อมูลไม่ถูกต้อง' };
    const heightInMeters = parseFloat(height) / 100;
    const bmiValue = (parseFloat(weight) / (heightInMeters * heightInMeters)).toFixed(2);
    let category = '';
    if (bmiValue < 18.5) category = 'น้ำหนักน้อยกว่าเกณฑ์';
    else if (bmiValue < 23) category = 'น้ำหนักปกติ (สมส่วน)';
    else if (bmiValue < 25) category = 'น้ำหนักเกิน';
    else if (bmiValue < 30) category = 'โรคอ้วนระดับที่ 1';
    else category = 'โรคอ้วนระดับที่ 2 (อันตราย)';
    return { value: bmiValue, category: category };
};
// --- Helper Function: ย้ายเข้ามาอยู่ใน Service Layer ---
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Helper Function: AI Analysis (ไม่มีการแก้ไข) ---
async function getAiAnalysis(userData) {
    
    // 1. สร้าง Context ที่ชัดเจนและสมบูรณ์
    // สร้างส่วนของโปรไฟล์ให้เป็น String ที่อ่านง่ายและจัดการได้
    let profileContext = "ผู้ใช้ไม่มีข้อมูลโปรไฟล์สุขภาพที่ระบุไว้เป็นพิเศษ"; // Default text
    if (userData.health_profile) {
        const parts = [];
        if (userData.health_profile.chronic_conditions?.length) parts.push(`โรคประจำตัวคือ ${userData.health_profile.chronic_conditions.join(', ')}`);
        if (userData.health_profile.lifestyle_factors?.length) parts.push(`มีไลฟ์สไตล์แบบ ${userData.health_profile.lifestyle_factors.join(', ')}`);
        if (userData.health_profile.additional_notes) parts.push(`มีบันทึกเพิ่มเติมว่า: "${userData.health_profile.additional_notes}"`);
        
        if (parts.length > 0) {
            profileContext = `ผู้ใช้มีโปรไฟล์สุขภาพที่ต้องพิจารณาเป็นพิเศษดังนี้: ${parts.join('. ')}.`;
        }
    }

    const fullContext = `
      วิเคราะห์ผู้ใช้ชื่อ ${userData.name} (อายุ ${userData.age} ปี, เพศ ${userData.sex}) ที่มี BMI ${userData.bmi.value} (${userData.bmi.category}).
      **สถานการณ์ปัจจุบัน:**
      - มีอาการ: "${userData.symptoms}"
      - เป็นมานาน: ${userData.symptom_duration}
      - มื้อล่าสุดทาน: ${userData.previous_meal}
      **ข้อมูลโปรไฟล์สุขภาพ (สำคัญที่สุด!): ${profileContext}**
    `;

    // 2. พิมพ์ Context ที่จะส่งให้ AI ออกมาดูใน Console เพื่อง่ายต่อการ Debug
    console.log("🤖 [Prompt V5] กำลังสร้าง Prompt ด้วย Context ต่อไปนี้:\n", fullContext);

    // 3. สร้าง Prompt ที่เน้น "คำสั่ง" และ "บทลงโทษ"
    const prompt = `
      **บทบาทและเป้าหมาย (Role and Goal):** คุณคือ AI ที่ปรึกษาด้านสุขภาพเชิงวิเคราะห์ (Analytical Wellness Advisor) เป้าหมายเดียวของคุณคือการนำ "ข้อมูลทั้งหมด" ที่ให้มา ไปสร้างการวิเคราะห์ที่เชื่อมโยงกันอย่างสมเหตุสมผลและปลอดภัย

      **ข้อมูลดิบสำหรับการวิเคราะห์ (RAW DATA FOR ANALYSIS):**
      ${fullContext}

            **กระบวนการคิดวิเคราะห์ (MANDATORY THINKING PROCESS):**
      ก่อนที่จะสร้าง JSON สุดท้าย ให้คุณเขียนกระบวนการคิดของคุณตามขั้นตอนต่อไปนี้ก่อน:
      1.  **สรุปข้อเท็จจริง (Fact Summary):** สรุปข้อมูลสำคัญทั้งหมดของผู้ใช้ (อาการ, ระยะเวลา, โปรไฟล์สุขภาพ) โดยไม่มีการตีความ
      2.  **ระบุภาวะที่เป็นไปได้ (Potential Conditions Analysis):** จาก "อาการปัจจุบัน" เป็นหลัก ให้ลิสต์ภาวะหรือโรคที่เป็นไปได้ 2-3 อย่าง พร้อมให้เหตุผลสั้นๆ ว่าทำไมถึงคิดว่าเป็นภาวะนั้นๆ
      3.  **ประเมินและจัดลำดับความเสี่ยง (Risk Evaluation):** นำภาวะจากข้อ 2 มาประเมินเทียบกับ "ข้อมูลโปรไฟล์สุขภาพ" และ "ข้อมูลอื่นๆ" เพื่อจัดลำดับความเสี่ยงจากสูงไปต่ำสุด อธิบายว่าทำไมภาวะ A ถึงเสี่ยงกว่าภาวะ B
      4.  **สรุปผลการวิเคราะห์ (Final Conclusion):** สรุปภาวะที่น่าจะเป็นไปได้มากที่สุดเพื่อนำไปสร้าง JSON
      
      **ข้อบังคับเรื่องข้อมูล (DATA ADHERENCE MANDATE):**
      วิเคราะห์จาก "ข้อมูลดิบ" ที่ให้มา *เท่านั้น* ห้ามอ้างอิงถึงโรคหรืออาการที่ไม่มีอยู่ในข้อมูลโดยเด็ดขาด การสร้างข้อมูลที่ไม่มีอยู่จริง (Hallucination) จะถือว่าเป็นการทำผิดคำสั่งร้ายแรง


      **คำสั่งที่ต้องปฏิบัติ (MANDATORY INSTRUCTIONS):**
      สร้างผลลัพธ์เป็น JSON object ที่สมบูรณ์ตามโครงสร้างนี้เท่านั้น **โดยเนื้อหาในทุกฟิลด์ต้องผ่านกระบวนการคิดที่เชื่อมโยงกับ "ข้อมูลโปรไฟล์สุขภาพ" หากมีข้อมูลดังกล่าว** หากไม่เชื่อมโยงจะถือว่าทำผิดคำสั่ง
      
      **โครงสร้าง JSON ที่ต้องส่งออก (MANDATORY JSON STRUCTURE):**
      {
        "primary_assessment": "เขียนบทสรุปที่ต้องขึ้นต้นด้วยการกล่าวถึงผลกระทบของข้อมูลจาก 'โปรไฟล์สุขภาพ' ที่มีต่อ 'อาการปัจจุบัน' ก่อนเสมอ",
        "risk_analysis": [{"condition": "...", "risk_level": "...", "rationale": "ต้องอธิบายว่าข้อมูลใน 'โปรไฟล์สุขภาพ' เพิ่มหรือลดความเสี่ยงของภาวะนี้อย่างไร"}],
        "personalized_care": {
          "immediate_actions": ["..."],
          "general_wellness": ["ต้องมีคำแนะนำอย่างน้อย 1 ข้อที่จำเพาะเจาะจงกับข้อมูลใน 'โปรไฟล์สุขภาพ' โดยตรง"],
          "activity_guidance": { "recommended": ["..."], "to_avoid": ["..."] }
        },
        "dietary_recommendations": {
          "concept": "ต้องอธิบายแนวคิดการทานอาหารที่สอดคล้องกับทั้ง 'อาการปัจจุบัน' และข้อมูลใน 'โปรไฟล์สุขภาพ'",
          "foods_to_eat": { "main_dishes": ["..."], "snacks_and_fruits": ["..."], "drinks": ["..."] },
          "foods_to_avoid": ["ต้องมีเหตุผลที่เชื่อมโยงกับข้อมูลใน 'โปรไฟล์สุขภาพ'"]
        },
        "red_flags": ["ต้องมีสัญญาณอันตรายอย่างน้อย 1 ข้อที่เกี่ยวข้องกับข้อมูลใน 'โปรไฟล์สุขภาพ'"],
        "disclaimer": "การประเมินนี้สร้างโดย AI เพื่อให้คำแนะนำเบื้องต้นเท่านั้น และพิจารณาจากข้อมูลที่คุณให้มา ไม่สามารถใช้แทนการวินิจฉัยจากแพทย์ได้ กรุณาปรึกษาบุคลากรทางการแพทย์เพื่อรับการวินิจฉัยและการรักษาที่ถูกต้อง"
      }


      **ข้อบังคับในการสร้างผลลัพธ์ (OUTPUT RULES): **
      1.  **เชื่อมโยงข้อมูลทั้งหมด:** คำแนะนำทุกส่วน ต้องอ้างอิงถึง 'ระยะเวลาของอาการ' และ 'อาหารมื้อล่าสุด' อย่างสมเหตุสมผล **และต้องพิจารณาข้อมูล 'โปรไฟล์สุขภาพ' (ถ้ามี) เป็นอันดับแรก**
      2.  สำหรับ "risk_level" ให้ใช้ค่าใดค่าหนึ่งเท่านั้น: 'high' (สีแดง), 'medium' (สีส้ม), 'low' (สีเหลือง), 'info' (สีฟ้า)
      3.  เรียงลำดับ "risk_analysis" จากความเสี่ยงสูงสุดไปต่ำสุด
      4.  ต้องสร้าง JSON ให้ครบทุกฟิลด์ ห้ามขาดหรือเกิน
      5.  เนื้อหาต้องปลอดภัย ห้ามวินิจฉัยโรค และ**ห้ามแนะนำให้ซื้อหรือใช้ยาใดๆ ทั้งสิ้น**
      6.  ปฏิบัติได้จริง: คำแนะนำต้องชัดเจนและนำไปใช้ในชีวิตประจำวันได้
      7.  ตอบเป็นภาษาไทยทั้งหมด ยกเว้นใน "risk_analysis" ที่ต้องมีชื่อโรคเป็นภาษาไทยและวงเล็บ (ภาษาอังกฤษ) เช่น "โรคเบาหวาน (Diabetes)"
      8.  สำหรับ "foods_to_eat" ต้องมีข้อมูลในทุกหมวดหมู่: "main_dishes" (อาหารหลัก), "snacks_and_fruits" (ของว่าง/ผลไม้), และ "drinks" (เครื่องดื่ม)
      9.  risk_analysis ต้องมีชื่อภาษาไทย และ วงเล็บ (ภาษาอังกฤษ) เช่น "โรคเบาหวาน (Diabetes)" เพื่อให้เข้าใจง่าย
      10. หลังจากบอกอาหารที่แนะนำและควรเลี่ยงแล้ว ต้องบอกสาเหตุด้วยว่าทำไมถึงแนะนำหรือเลี่ยงอาหารเหล่านั้น โดยเฉพาะอย่างยิ่งถ้ามีข้อมูลใน 'โปรไฟล์สุขภาพ'
      11. **ลำดับความสำคัญ:** ให้ความสำคัญกับ "อาการปัจจุบัน" (Acute Symptoms) มากกว่า "โรคประจำตัว" (Chronic Conditions) ในการประเมินความเสี่ยง
      12. **ห้ามหลอนข้อมูล:** ปฏิบัติตาม "DATA ADHERENCE MANDATE" อย่างเคร่งครัด   
       `;
        const jsonStringResponse = await aiConnector.generateContent(prompt); 
let analysisResult = JSON.parse(jsonStringResponse);

    // --- เพิ่มบรรทัดนี้เข้าไป ---
    analysisResult = normalizeAiResponse(analysisResult);

    return analysisResult;
}

// --- The Main Public Function of this Service ---
// นี่คือฟังก์ชันที่ Controller จะเรียกใช้
async function getAiAssessment(userData) {
    const { name, age, sex, weight, height, symptoms, health_profile, symptom_duration, previous_meal } = userData;

    console.log(`[Service] เริ่มกระบวนการสำหรับ: ${name}`);
    const bmi = calculateBMI(weight, height);
    console.log(`[Service] คำนวณ BMI ได้: ${bmi.value} (${bmi.category})`);

    const dataForAI = { name, age, sex, bmi, symptoms, health_profile, symptom_duration, previous_meal };

    let analysis;
    let lastAiError = null;
    const maxRetries = 5;

    // Logic การ Retry ที่ยอดเยี่ยมของคุณจะอยู่ที่นี่ ในใจกลางของ Business Logic
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[Service Attempt ${attempt}/${maxRetries}] กำลังเรียกใช้ AI...`);
            analysis = await getAiAnalysis(dataForAI);
            console.log(`✅ [Service Attempt ${attempt}] สำเร็จ: วิเคราะห์ AI เรียบร้อย`);
            lastAiError = null;
            break; 
        } catch (aiError) {
            lastAiError = aiError;
            console.error(`❌ [Service Attempt ${attempt}] ล้มเหลว: ${aiError.message}`);
            if (attempt < maxRetries) {
                const waitTime = 2000;
                await delay(waitTime);
            }
        }
    }
    // Logic การสร้าง Fallback Response ก็อยู่ที่นี่เช่นกัน
    if (lastAiError) {
        console.error(`🚨 [Service] ไม่สามารถเชื่อมต่อ AI ได้หลังจากการพยายามครบ ${maxRetries} ครั้ง`);
        analysis = {
                primary_assessment: "ไม่สามารถสร้างบทวิเคราะห์จาก AI ได้ เนื่องจากปัญหาการเชื่อมต่อเซิร์ฟเวอร์ชั่วคราว",
                risk_analysis: [ { condition: "การเชื่อมต่อ AI ขัดข้อง", risk_level: "info", rationale: "ระบบไม่สามารถติดต่อ AI เพื่อทำการวิเคราะห์ความเสี่ยงได้ในขณะนี้" } ],
                self_care: ["โปรดลองอีกครั้งในภายหลัง", "หากอาการน่ากังวล ควรปรึกษาแพทย์โดยตรง"],
                dietary_recommendations: { foods_to_eat: { main_dishes: [], snacks_and_fruits: [], drinks: [] }, foods_to_avoid: [] },
                red_flags: ["หากอาการแย่ลงอย่างรวดเร็ว ควรรีบไปพบแพทย์ทันที"],
                disclaimer: `เกิดข้อผิดพลาดในการสื่อสารกับ AI หลังจากพยายาม ${maxRetries} ครั้ง: ${lastAiError.message}`
        };
    }
    
    // Service คืนผลลัพธ์ทั้งหมดเป็น Object เดียว
    return {
        userInfo: { name, age, sex },
        bmi: { ...bmi, weight, height },
        analysis: analysis
    };
}
// ที่นี่เราจะ "Fake" การทำงานของ AI
function performDiagnosis(userData) {
    const { symptoms } = userData;
    let diagnosis = "ไม่สามารถระบุได้ชัดเจน กรุณาปรึกษาแพทย์";

    if (symptoms.includes('fever') && symptoms.includes('cough')) {
        diagnosis = "คุณอาจจะเป็นไข้หวัด ควรพักผ่อนให้เพียงพอและดื่มน้ำมากๆ";
    } else if (symptoms.includes('headache')) {
        diagnosis = "อาการปวดหัวอาจเกิดได้จากหลายสาเหตุ เช่น ความเครียด หรือการพักผ่อนไม่เพียงพอ";
    }

    // Logic ที่ซับซ้อนอื่นๆ สามารถเพิ่มได้ที่นี่
    // ในอนาคต เราอาจจะเรียก Model AI จริงๆ จากฟังก์ชันนี้

    // TODO: ใน Step ถัดไป เราจะเพิ่มการเรียก Repository เพื่อบันทึกผล
    
    return {
        userInput: userData,
        diagnosis: diagnosis
    };
}

// --- เพิ่มฟังก์ชันนี้เข้าไป ---
/**
 * จัดระเบียบข้อมูลที่ได้จาก AI ให้มีโครงสร้างตรงตามที่เราต้องการเสมอ
 * @param {object} analysis - The analysis object parsed from the AI's JSON response.
 * @returns {object} - The normalized analysis object.
 */
const normalizeAiResponse = (analysis) => {
    console.log("🔄 [Service] กำลังจัดระเบียบข้อมูลจาก AI...");

    // ตรวจสอบให้แน่ใจว่า personalized_care มีอยู่จริง
    if (!analysis.personalized_care) {
        analysis.personalized_care = {};
    }
    const care = analysis.personalized_care;

    // 1. แก้ไข general_wellness: ถ้าเป็น String ให้แปลงเป็น Array
    if (typeof care.general_wellness === 'string') {
        console.log("  - แก้ไข 'general_wellness': string -> array");
        care.general_wellness = [care.general_wellness];
    } else if (!Array.isArray(care.general_wellness)) {
        care.general_wellness = []; // ถ้าเป็นประเภทอื่นที่ไม่ใช่ทั้ง string และ array ให้เป็น array ว่าง
    }

    // 2. แก้ไข activity_guidance: ถ้าเป็น Array ให้แปลงเป็น Object ที่ถูกต้อง
    if (Array.isArray(care.activity_guidance)) {
        console.log("  - แก้ไข 'activity_guidance': array -> object");
        care.activity_guidance = {
            recommended: care.activity_guidance,
            to_avoid: [] // สร้าง to_avoid ว่างๆ ไว้ให้
        };
    } else if (typeof care.activity_guidance !== 'object' || care.activity_guidance === null) {
        // ถ้าเป็นประเภทอื่นที่ไม่ใช่ array และ object ให้สร้าง object ว่างๆ ขึ้นมา
        care.activity_guidance = { recommended: [], to_avoid: [] };
    }
     // --- เพิ่มส่วนของ red_flags เข้าไปตรงนี้ ---
    if (Array.isArray(analysis.red_flags) && analysis.red_flags.length > 0 && typeof analysis.red_flags[0] === 'object') {
        console.log("  - แก้ไข 'red_flags': array of objects -> array of strings");
        // ทำการ map เพื่อดึงเฉพาะค่า 'condition' ออกมาสร้างเป็น Array ใหม่
        analysis.red_flags = analysis.red_flags.map(flag => flag.condition || "ข้อมูลไม่ถูกต้อง");
    }
    if (analysis.dietary_recommendations && typeof analysis.dietary_recommendations.foods_to_avoid === 'object' && !Array.isArray(analysis.dietary_recommendations.foods_to_avoid)) {
        console.log("  - แก้ไข 'foods_to_avoid': object -> array");
        // ถ้ามันเป็น Object (เหมือนใน Log) ให้ดึงค่า reasoning มาสร้างเป็น Array
        if (analysis.dietary_recommendations.foods_to_avoid.reasoning) {
            analysis.dietary_recommendations.foods_to_avoid = [analysis.dietary_recommendations.foods_to_avoid.reasoning];
        } else {
            // ถ้าเป็น Object แต่ไม่มี reasoning ให้แปลงเป็น Array ว่าง
            analysis.dietary_recommendations.foods_to_avoid = [];
        }
    }
    console.log("👍 [Service] จัดระเบียบข้อมูลเรียบร้อย");
    return analysis;
};
export default { getAiAssessment }; // Export เป็น Object เพื่อให้ง่ายต่อการเพิ่มฟังก์ชันอื่นในอนาคต```

// module.exports = { performDiagnosis };
```


--- FILE: src/services/gemini.config.js ---

```javascript
// File: src/config/gemini.config.js
import 'dotenv/config'; // Make sure environment variables are loaded
import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment Check - Fail fast ONLY if gemini is the selected provider and key is missing
if (process.env.AI_PROVIDER === 'gemini' && !process.env.GEMINI_API_KEY) {
    throw new Error("FATAL ERROR: AI_PROVIDER is set to 'gemini' but GEMINI_API_KEY is not defined in your .env file.");
}

// ใช้ let เพื่อให้สามารถเป็น null ได้
let genAI = null;
let diagnosisModel = null;

// สร้าง instance ต่อเมื่อมี API Key เท่านั้น
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Create a specific model instance for our diagnosis task
    diagnosisModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { response_mime_type: "application/json" }
    });
}

export { diagnosisModel };
```


--- FILE: src/utils/logger.js ---

```javascript

```


--- FILE: vercel.json ---

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server.js"
    },
    {
      "src": "/(.*)",
      "dest": "public/$1"
    }
  ]
}
```
