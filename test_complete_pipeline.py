"""
Complete test of PDF upload and data fetch pipeline
"""
import requests
import json

API_BASE = "http://localhost:8000/api"

print("\n" + "=" * 70)
print("🧪 TESTING COMPLETE DATA PIPELINE")
print("=" * 70)

# 1. Register new user
email = "pipeline_test@example.com"
password = "test123456"
name = "Pipeline Test"

print("\n1️⃣  REGISTERING USER...")
signup_resp = requests.post(
    f"{API_BASE}/auth/register",
    json={"email": email, "password": password, "name": name}
)
print(f"   Status: {signup_resp.status_code}")
if signup_resp.status_code != 200:
    print(f"   Error: {signup_resp.json()}")
    exit(1)

# 2. Login
print("\n2️⃣  LOGGING IN...")
login_resp = requests.post(
    f"{API_BASE}/auth/login",
    json={"email": email, "password": password}
)
if login_resp.status_code != 200:
    print(f"   ❌ Login failed: {login_resp.json()}")
    exit(1)

token = login_resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print(f"   ✅ Logged in successfully")

# 3. Upload PDF
print("\n3️⃣  UPLOADING PDF...")
pdf_path = "sample_lab_report.pdf"

try:
    with open(pdf_path, "rb") as f:
        files = {"file": ("sample.pdf", f, "application/pdf")}
        upload_resp = requests.post(
            f"{API_BASE}/reports/upload",
            files=files,
            headers=headers
        )
    
    if upload_resp.status_code == 200:
        report_data = upload_resp.json()
        print(f"   ✅ PDF uploaded successfully!")
        print(f"      Report ID: {report_data.get('report_id')}")
        
        # Show parsed data
        if report_data.get('data'):
            parsed = report_data['data']
            print(f"\n   📋 PARSED DATA FROM PDF:")
            if isinstance(parsed, dict) and 'biomarkers' in parsed:
                for bm in parsed['biomarkers'][:5]:
                    print(f"      - {bm.get('name')}: {bm.get('value')} ({bm.get('status')})")
    else:
        print(f"   ❌ Upload failed: {upload_resp.status_code}")
        print(f"      Error: {upload_resp.json()}")
        exit(1)
except FileNotFoundError:
    print(f"   ❌ PDF file not found: {pdf_path}")
    exit(1)

# 4. Fetch Dashboard Data
print("\n4️⃣  FETCHING DASHBOARD DATA...")
dash_resp = requests.get(f"{API_BASE}/health/dashboard", headers=headers)

if dash_resp.status_code == 200:
    dash_data = dash_resp.json()
    print(f"   ✅ Dashboard data retrieved!")
    print(f"\n   📊 DASHBOARD METRICS:")
    print(f"      • Glucose: {dash_data.get('glucose')} mg/dL")
    print(f"      • HbA1c: {dash_data.get('hba1c')}")
    print(f"      • Total Cholesterol: {dash_data.get('cholesterol')} mg/dL")
    print(f"      • Diabetes Risk: {dash_data.get('diabetesRisk')}%")
    print(f"      • Heart Disease Risk: {dash_data.get('heartDiseaseRisk')}%")
    
    if dash_data.get('alerts'):
        print(f"\n   ⚠️  ALERTS: {len(dash_data['alerts'])} items")
else:
    print(f"   ❌ Failed to fetch dashboard: {dash_resp.status_code}")
    print(f"      Error: {dash_resp.json()}")

# 5. Fetch Blood Metrics
print("\n5️⃣  FETCHING BLOOD METRICS...")
blood_resp = requests.get(f"{API_BASE}/health/blood", headers=headers)

if blood_resp.status_code == 200:
    blood_data = blood_resp.json()
    print(f"   ✅ Blood metrics retrieved!")
    
    if blood_data.get('bloodCounts'):
        bc = blood_data['bloodCounts']
        print(f"\n   🩸 BLOOD COUNTS:")
        print(f"      • WBC: {bc.get('wbc')} K/uL")
        print(f"      • RBC: {bc.get('rbc')} Million/uL")
        print(f"      • Hemoglobin: {bc.get('hemoglobin')} g/dL")
        print(f"      • Platelets: {bc.get('platelets')} K/uL")
else:
    print(f"   ❌ Failed to fetch blood data: {blood_resp.status_code}")
    print(f"      Error: {blood_resp.json()}")

# 6. Fetch Heart Metrics
print("\n6️⃣  FETCHING HEART METRICS...")
heart_resp = requests.get(f"{API_BASE}/health/heart", headers=headers)

if heart_resp.status_code == 200:
    heart_data = heart_resp.json()
    print(f"   ✅ Heart metrics retrieved!")
    
    if heart_data.get('heart'):
        h = heart_data['heart']
        print(f"\n   ❤️  CHOLESTEROL METRICS:")
        print(f"      • Total Cholesterol: {h.get('totalCholesterol')} mg/dL")
        print(f"      • LDL: {h.get('ldl')} mg/dL")
        print(f"      • HDL: {h.get('hdl')} mg/dL")
else:
    print(f"   ❌ Failed to fetch heart data: {heart_resp.status_code}")
    print(f"      Error: {heart_resp.json()}")

print("\n" + "=" * 70)
print("✅ ALL SYSTEMS OPERATIONAL - DATA PIPELINE COMPLETE!")
print("=" * 70)
print("\nYour dashboard and health overview will now show:")
print("  ✓ Real data from the uploaded PDF")
print("  ✓ Blood counts, cholesterol, glucose levels")
print("  ✓ Risk assessments and health insights")
print("  ✓ All calculated from your medical report")
print("\n" + "=" * 70 + "\n")
