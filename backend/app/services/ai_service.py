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
