from typing import List, Dict
from app.config import settings
import json

# Try to import transformers for local AI
try:
    from transformers import pipeline
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False

class AIService:
    """Service for AI-powered health analysis"""
    
    def __init__(self):
        self.model_pipeline = None
        if HAS_TRANSFORMERS and settings.use_local_ai:
            try:
                # Load sentiment analysis pipeline for symptoms
                self.model_pipeline = pipeline(
                    "zero-shot-classification",
                    model="facebook/bart-large-mnli"
                )
            except Exception as e:
                print(f"Warning: Could not load AI model: {e}")
    
    def analyze_symptoms(self, symptoms: List[str]) -> List[Dict]:
        """
        Analyze symptoms and predict potential diseases
        Returns list of disease predictions with probabilities
        """
        
        # Disease-symptom mapping (rule-based for now)
        disease_patterns = {
            "Type 2 Diabetes": {
                "keywords": ["fatigue", "thirst", "frequent urination", "weight loss", "glucose", "hba1c"],
                "base_probability": 0.0,
                "description": "Based on symptoms and glucose levels, Type 2 Diabetes risk is elevated.",
                "actions": [
                    "Schedule appointment with endocrinologist",
                    "Get HbA1c test every 3 months",
                    "Follow recommended diet plan",
                    "Monitor blood sugar daily"
                ]
            },
            "Cardiovascular Disease": {
                "keywords": ["chest pain", "shortness of breath", "cholesterol", "ldl", "heart", "pressure"],
                "base_probability": 0.0,
                "description": "Based on symptoms and lipid panel, cardiovascular risk is present.",
                "actions": [
                    "Consult with cardiologist",
                    "Lipid panel test quarterly",
                    "Regular exercise routine",
                    "Monitor blood pressure daily"
                ]
            },
            "Vitamin D Deficiency": {
                "keywords": ["fatigue", "bone pain", "muscle weakness", "mood changes", "vitamin d"],
                "base_probability": 0.0,
                "description": "Low vitamin D levels detected. Supplementation recommended.",
                "actions": [
                    "Vitamin D supplementation (as prescribed)",
                    "Increase sun exposure (15-20 min daily)",
                    "Include vitamin D rich foods",
                    "Retest in 3 months"
                ]
            },
            "Anemia": {
                "keywords": ["fatigue", "shortness of breath", "pale", "dizzy", "rbc", "hemoglobin"],
                "base_probability": 0.0,
                "description": "Low hemoglobin/RBC levels suggest anemia.",
                "actions": [
                    "High iron diet (red meat, spinach, legumes)",
                    "Iron supplementation",
                    "B12 supplementation if needed",
                    "Retest hemoglobin in 6 weeks"
                ]
            },
            "Hypertension": {
                "keywords": ["high blood pressure", "headache", "chest pain", "pressure", "systolic"],
                "base_probability": 0.0,
                "description": "Elevated blood pressure detected. Lifestyle changes recommended.",
                "actions": [
                    "Reduce sodium intake",
                    "Daily exercise (30 min)",
                    "Stress management",
                    "Monitor daily"
                ]
            }
        }
        
        # Score diseases based on symptom matching
        symptom_lower = [s.lower() for s in symptoms]
        
        for disease, pattern in disease_patterns.items():
            matches = sum(1 for keyword in pattern["keywords"] if keyword in symptom_lower)
            probability = min(100, (matches / len(pattern["keywords"])) * 100 + pattern["base_probability"])
            pattern["base_probability"] = probability
        
        # Sort by probability and format response
        results = []
        for disease, pattern in sorted(disease_patterns.items(), 
                                       key=lambda x: x[1]["base_probability"], 
                                       reverse=True):
            if pattern["base_probability"] > 0:
                probability = int(pattern["base_probability"])
                if probability > 70:
                    risk = "high"
                elif probability > 40:
                    risk = "medium"
                else:
                    risk = "low"
                
                results.append({
                    "disease": disease,
                    "probability": probability,
                    "risk": risk,
                    "description": pattern["description"],
                    "suggestedActions": pattern["actions"]
                })
        
        return results[:3]  # Return top 3 predictions
    
    def generate_health_response(self, query: str, health_metrics: Dict = None) -> str:
        """
        Generate AI response to health-related questions
        Uses context from health metrics when available
        """
        
        # AI response templates based on query patterns
        response_templates = {
            "hba1c": "Your HbA1c level indicates your average blood glucose over the past 2-3 months. "
                    "Elevated levels suggest higher diabetes risk. Consider dietary changes, regular exercise, "
                    "and consulting with your healthcare provider.",
            
            "cholesterol": "Cholesterol management is crucial for heart health. Focus on reducing saturated fats, "
                          "increasing fiber, and regular exercise. Your LDL (bad) cholesterol should ideally be low, "
                          "while HDL (good) cholesterol should be high.",
            
            "diabetes": "Type 2 Diabetes is manageable through lifestyle changes and medication if needed. "
                       "Key steps: maintain healthy weight, exercise regularly, eat balanced meals, and monitor blood sugar.",
            
            "blood pressure": "High blood pressure increases heart disease risk. Reduce sodium, manage stress, "
                            "exercise regularly, and maintain a healthy weight. Monitor daily if possible.",
            
            "vitamin": "Vitamins are essential for various body functions. Deficiencies can cause fatigue, weakness, "
                      "and immune issues. A balanced diet or supplements can help. Consult your doctor for specific needs.",
            
            "fatigue": "Fatigue can result from various causes: sleep issues, stress, vitamin deficiencies, or underlying conditions. "
                      "Ensure adequate sleep, manage stress, and monitor other symptoms.",
            
            "default": "I can help explain your lab results and health metrics. Please ask specific questions about "
                      "your test results, and I'll provide guidance. Remember to consult your healthcare provider for medical advice."
        }
        
        # Find matching template
        query_lower = query.lower()
        for keyword, template in response_templates.items():
            if keyword in query_lower:
                return template
        
        return response_templates["default"]
    
    def generate_diet_plan(self, health_metrics: Dict) -> Dict:
        """
        Generate personalized diet plan based on health metrics
        """
        plan = {
            "breakfast": [
                "Oatmeal with berries and nuts",
                "Boiled eggs (2 whites)",
                "Green tea or black coffee"
            ],
            "lunch": [
                "Grilled chicken breast with brown rice",
                "Steamed vegetables (broccoli, carrots)",
                "Olive oil dressing"
            ],
            "dinner": [
                "Baked salmon with sweet potato",
                "Spinach salad with lemon dressing",
                "Herbal tea"
            ],
            "snacks": [
                "Fresh fruits (apple, berries)",
                "Almonds or walnuts (small handful)",
                "Low-fat yogurt"
            ],
            "recommendations": [
                "Reduce sugar intake - aim for <25g per day",
                "Increase fiber - 25-30g daily",
                "Stay hydrated - 8 glasses of water daily",
                "Limit sodium - <2300mg per day",
                "Limit saturated fats - <7% of calories"
            ]
        }
        
        # Customize based on HbA1c if available
        if health_metrics.get("hba1c") and health_metrics["hba1c"] > 6.5:
            plan["recommendations"].append("Focus on low glycemic index foods")
            plan["recommendations"].append("Time meals at regular intervals")
        
        # Customize based on cholesterol if available
        if health_metrics.get("total_cholesterol") and health_metrics["total_cholesterol"] > 200:
            plan["recommendations"].append("Reduce saturated fats from meat and dairy")
            plan["recommendations"].append("Increase omega-3 foods (fish, flax)")
        
        return plan

# Global AI service instance
ai_service = AIService()
