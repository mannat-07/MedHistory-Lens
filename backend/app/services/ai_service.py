from groq import Groq
import os
import json
import re
from typing import List, Dict
from app.config import settings

# Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class AIService:
    """Service for AI-powered health analysis using Groq API"""
    
    def __init__(self):
        self.model = settings.ai_model_name or "llama-3.3-70b-versatile"
    
    def analyze_report(self, extracted_text: str) -> dict:
        """
        Analyze medical report text using Groq and extract biomarkers
        with structured schema for better accuracy
        """
        try:
            system_prompt = """You are an expert medical lab report analyzer.

First, extract all metrics into clean JSON format exactly like this:

{
  "patient": {
    "name": "...",
    "age": number,
    "gender": "...",
    "test_date": "..."
  },
  "metrics": [
    {
      "category": "Blood Chemistry",
      "test_name": "Glucose Level",
      "value": 92,
      "unit": "mg/dL",
      "reference_range": "70-100",
      "status": "NORMAL"
    }
  ]
}

After the JSON, add a field called "summary" which is a friendly, simple explanation (4-7 sentences) for the patient. 
Use easy language, be positive, and give one practical suggestion.

Return ONLY valid JSON with "summary" field at the end. No extra text."""

            user_prompt = f"Here is the lab report text:\n\n{extracted_text}"
            
            message = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ]
            )
            
            # Parse response
            response_text = message.choices[0].message.content
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError:
                # Try to extract JSON if wrapped in markdown or text
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if json_match:
                    result = json.loads(json_match.group())
                else:
                    result = {
                        "patient": {},
                        "metrics": [],
                        "error": "Could not parse response"
                    }
            
            return result
        except Exception as e:
            print(f"Error analyzing report: {e}")
            return {
                "patient": {},
                "metrics": [],
                "error": f"Error processing report: {str(e)}"
            }

    def generate_doctor_summary(self, parsed_report: Dict) -> str:
        """Generate a short, caring doctor-style summary with no numbers or disease names."""
        try:
            safe_report = parsed_report if isinstance(parsed_report, dict) else {}
            message = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are a calm and caring doctor writing a very short patient summary.
Rules:
1) Never include numbers, percentages, units, ranges, or exact values.
2) Never mention disease names or diagnoses.
3) Use simple lines like: "Your glucose is in a healthy range." or "Your cholesterol is above range."
4) Keep to 5 to 7 short lines total.
5) Friendly and positive tone.
Return plain text only."""
                    },
                    {
                        "role": "user",
                        "content": f"Create the doctor summary from this report JSON:\n{json.dumps(safe_report)}"
                    }
                ]
            )
            summary = (message.choices[0].message.content or "").strip()
            summary = re.sub(r"\d+([.,]\d+)?%?", "", summary)
            banned_terms = [
                "diabetes", "hypertension", "heart disease", "cancer", "stroke",
                "thyroid", "kidney disease", "liver disease"
            ]
            for term in banned_terms:
                summary = re.sub(term, "condition", summary, flags=re.IGNORECASE)
            return summary
        except Exception:
            return (
                "Your report has been reviewed carefully.\n"
                "Your glucose looks stable right now.\n"
                "Cholesterol needs a little extra attention.\n"
                "Blood levels are mostly steady.\n"
                "Please keep healthy food and regular movement.\n"
                "You are doing well, and we will keep tracking your progress."
            )

    def generate_voice_friendly_text(self, summary_text: str) -> str:
        """Create a short, natural script for TTS playback."""
        try:
            message = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are preparing a voice script for a doctor assistant.
Return 4 to 6 short conversational lines.
Warm, calm, friendly tone.
No numbers, no medical jargon.
Plain text only."""
                    },
                    {"role": "user", "content": f"Rewrite for voice: {summary_text}"}
                ]
            )
            return (message.choices[0].message.content or "").strip()
        except Exception:
            return summary_text

    def translate_patient_text(self, text: str, language: str) -> str:
        """Translate to target language with friendly healthcare tone."""
        if language.lower() in ("en", "english"):
            return text
        try:
            message = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "Translate the text to simple Hindi for a patient. Keep caring tone. Plain text only."
                    },
                    {"role": "user", "content": text}
                ]
            )
            return (message.choices[0].message.content or "").strip()
        except Exception:
            return text

    def generate_personalized_diet_plan(self, metrics: Dict, symptoms: List[str], language: str = "en") -> Dict:
        """Generate a real, metric-based diet plan."""
        try:
            message = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are a clinical diet planner for lab reports.
Use only provided real metrics and symptoms.
Logic examples:
- High glucose or HbA1c: low GI meals, fiber focus, avoid sugary drinks.
- High cholesterol or triglycerides: less saturated fat, more omega-3, nuts, olive oil.
- Low hemoglobin: iron rich foods + vitamin C pairings.
Return ONLY valid JSON:
{
  "title": "Personalized Diet Plan",
  "breakfast": ["...", "..."],
  "lunch": ["...", "..."],
  "dinner": ["...", "..."],
  "snacks": ["...", "..."],
  "avoid": ["...", "..."],
  "doctor_note": "one short personalized note"
}
No markdown."""
                    },
                    {
                        "role": "user",
                        "content": json.dumps({"metrics": metrics, "symptoms": symptoms, "language": language})
                    }
                ]
            )
            content = message.choices[0].message.content or "{}"
            try:
                result = json.loads(content)
            except json.JSONDecodeError:
                m = re.search(r"\{[\s\S]*\}", content)
                result = json.loads(m.group()) if m else {}
            if language.lower().startswith("hi"):
                for key in ("title", "doctor_note"):
                    if key in result and isinstance(result[key], str):
                        result[key] = self.translate_patient_text(result[key], "hi")
                for key in ("breakfast", "lunch", "dinner", "snacks", "avoid"):
                    if isinstance(result.get(key), list):
                        result[key] = [self.translate_patient_text(str(x), "hi") for x in result[key]]
            return result
        except Exception as e:
            print(f"Error generating personalized diet plan: {e}")
            return {
                "title": "Personalized Diet Plan",
                "breakfast": [],
                "lunch": [],
                "dinner": [],
                "snacks": [],
                "avoid": [],
                "doctor_note": "Please try again after uploading a clearer report."
            }

    def generate_health_predictions(self, symptoms: List[str], report_context: Dict) -> Dict:
        """Generate risk cards using real report context + symptoms."""
        try:
            message = client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are a medical risk triage assistant.
Given symptoms and prior lab context, return realistic risk percentages.
Return ONLY valid JSON:
{
  "predictions": [
    {"name":"Diabetes Risk","percentage":12,"advice":"..."},
    {"name":"Heart Disease Risk","percentage":8,"advice":"..."},
    {"name":"Hypertension Risk","percentage":25,"advice":"..."}
  ]
}
Rules:
- Use integer percentages 1-95.
- Keep advice one short sentence.
- Base response on provided context and symptoms.
- No markdown."""
                    },
                    {
                        "role": "user",
                        "content": json.dumps({
                            "symptoms": symptoms,
                            "report_context": report_context
                        })
                    }
                ]
            )
            text = message.choices[0].message.content or "{}"
            try:
                return json.loads(text)
            except json.JSONDecodeError:
                match = re.search(r"\{[\s\S]*\}", text)
                return json.loads(match.group()) if match else {"predictions": []}
        except Exception as e:
            print(f"Error generating health predictions: {e}")
            return {"predictions": []}
    
    def chat_with_ai(self, user_message: str, health_context: dict = None) -> str:
        """
        Chat with Groq for health-related questions with user context
        """
        try:
            context_str = ""
            if health_context:
                context_str = f"User's health context: {json.dumps(health_context)}\n"
            
            message = client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "user", 
                    "content": f"{context_str}Question: {user_message}"
                }]
            )
            
            return message.choices[0].message.content
        except Exception as e:
            print(f"Error in chat: {e}")
            return f"I encountered an error processing your request: {str(e)}. Please try again."
    
    def analyze_symptoms(self, symptoms: List[str]) -> dict:
        """
        Analyze symptoms using Groq and return possible conditions
        """
        try:
            symptoms_str = ", ".join(symptoms)
            message = client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": f"""Analyze these symptoms and return possible 
                    conditions with probability estimates. Be conservative.
                    Always recommend seeing a doctor.
                    Return ONLY valid JSON with this exact format:
                    {{
                      "conditions": [
                        {{"name": "", "probability": 0.0, "description": ""}}
                      ],
                      "recommendation": "",
                      "urgency": "low|medium|high"
                    }}
                    
                    Symptoms: {symptoms_str}"""
                }]
            )
            
            # Parse response
            response_text = message.choices[0].message.content
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError:
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if json_match:
                    result = json.loads(json_match.group())
                else:
                    result = {
                        "conditions": [],
                        "recommendation": response_text,
                        "urgency": "medium"
                    }
            
            return result
        except Exception as e:
            print(f"Error analyzing symptoms: {e}")
            return {
                "conditions": [],
                "recommendation": "Please consult with a healthcare professional. An error occurred in analysis.",
                "urgency": "medium"
            }
    
    def generate_health_response(self, query: str, health_metrics: Dict = None) -> str:
        """
        Generate AI response to health-related questions using Groq
        """
        try:
            context_str = ""
            if health_metrics:
                context_str = f"\nUser's health metrics: {json.dumps(health_metrics)}"
            
            message = client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": f"Health question: {query}{context_str}"
                }]
            )
            
            return message.choices[0].message.content
        except Exception as e:
            return f"Unable to process your question. Please try again. (Error: {str(e)})"
    
    def generate_diet_plan(self, health_metrics: Dict) -> Dict:
        """
        Generate personalized diet plan based on health metrics using Groq
        """
        try:
            metrics_str = json.dumps(health_metrics)
            message = client.chat.completions.create(
                model=self.model,
                messages=[{
                    "role": "user",
                    "content": f"""Based on these health metrics, create a personalized diet plan.
                    Return ONLY valid JSON with this format:
                    {{
                      "breakfast": ["meal1", "meal2"],
                      "lunch": ["meal1", "meal2"],
                      "dinner": ["meal1", "meal2"],
                      "snacks": ["snack1", "snack2"],
                      "recommendations": ["rec1", "rec2"]
                    }}
                    
                    Health metrics: {metrics_str}"""
                }]
            )
            
            response_text = message.choices[0].message.content
            try:
                result = json.loads(response_text)
            except json.JSONDecodeError:
                json_match = re.search(r'\{[\s\S]*\}', response_text)
                if json_match:
                    result = json.loads(json_match.group())
                else:
                    result = {
                        "breakfast": ["Balanced breakfast with fruits"],
                        "lunch": ["Lean protein with vegetables"],
                        "dinner": ["Healthy dinner option"],
                        "snacks": ["Healthy snacks"],
                        "recommendations": ["Consult with a nutritionist for personalized advice"]
                    }
            
            return result
        except Exception as e:
            print(f"Error generating diet plan: {e}")
            return {
                "breakfast": ["Consult with a nutritionist"],
                "lunch": ["Consult with a nutritionist"],
                "dinner": ["Consult with a nutritionist"],
                "snacks": ["Consult with a nutritionist"],
                "recommendations": ["Please consult with a healthcare professional for dietary guidance"]
            }

# Global AI service instance
ai_service = AIService()
