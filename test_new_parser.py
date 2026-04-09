#!/usr/bin/env python3
"""Test the improved medical report parsing with new schema"""
import sys
sys.path.insert(0, 'backend')

from app.services.ai_service import ai_service

# Sample lab report text
sample_report = """
PATIENT: John Doe
AGE: 45
GENDER: Male
TEST DATE: 2026-03-15
DOCTOR: Dr. Smith

LABORATORY TEST RESULTS
======================

COMPLETE BLOOD COUNT:
- WBC (White Blood Cells): 7.2 (Reference: 4.5-11.0 10^3/μL) - NORMAL
- RBC (Red Blood Cells): 4.8 (Reference: 4.5-5.5 10^6/μL) - NORMAL
- Hemoglobin: 14.5 g/dL (Reference: 12-16 g/dL) - NORMAL
- Platelets: 250 10^3/μL (Reference: 150-400 10^3/μL) - NORMAL

BLOOD CHEMISTRY:
- Glucose: 110 mg/dL (Reference: 70-100 mg/dL) - HIGH
- HbA1c: 6.5% (Reference: 4.0-5.6%) - ABNORMAL

LIPID PROFILE:
- Total Cholesterol: 220 mg/dL (Reference: <200 mg/dL) - HIGH
- LDL Cholesterol: 155 mg/dL (Reference: <100 mg/dL) - HIGH
- HDL Cholesterol: 35 mg/dL (Reference: >40 mg/dL) - LOW
- Triglycerides: 180 mg/dL (Reference: <150 mg/dL) - HIGH

ORGAN FUNCTION:
- Creatinine: 1.1 mg/dL (Reference: 0.7-1.3 mg/dL) - NORMAL
- ALT (Alanine Aminotransferase): 28 U/L (Reference: 7-56 U/L) - NORMAL
- AST (Aspartate Aminotransferase): 32 U/L (Reference: 10-40 U/L) - NORMAL

VITAMINS & MINERALS:
- Vitamin D: 25 ng/mL (Reference: 30-100 ng/mL) - LOW
- Vitamin B12: 450 pg/mL (Reference: 200-1000 pg/mL) - NORMAL
- Iron: 85 μg/dL (Reference: 60-170 μg/dL) - NORMAL
"""

print("=" * 70)
print("TESTING IMPROVED MEDICAL REPORT PARSER")
print("=" * 70)
print("\nInput Report:")
print("-" * 70)
print(sample_report)
print("-" * 70)

print("\nParsing with new schema...\n")
result = ai_service.analyze_report(sample_report)

print("PARSED RESULT:")
print("=" * 70)

import json
print(json.dumps(result, indent=2))

print("\n" + "=" * 70)
print("ANALYSIS:")
print("=" * 70)

if isinstance(result, dict):
    patient = result.get("patient", {})
    metrics = result.get("metrics", [])
    
    print(f"\nPatient Information:")
    print(f"  Name: {patient.get('name', 'N/A')}")
    print(f"  Age: {patient.get('age', 'N/A')}")
    print(f"  Gender: {patient.get('gender', 'N/A')}")
    print(f"  Test Date: {patient.get('test_date', 'N/A')}")
    
    print(f"\nExtracted Metrics: {len(metrics)} items")
    
    # Group by category
    categories = {}
    for metric in metrics:
        cat = metric.get("category", "Other")
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(metric)
    
    for category in sorted(categories.keys()):
        print(f"\n  {category}:")
        for metric in categories[category]:
            status = metric.get("status", "UNKNOWN")
            print(f"    - {metric.get('test_name')}: {metric.get('value')} {metric.get('unit')} ({status})")

print("\n" + "=" * 70)
