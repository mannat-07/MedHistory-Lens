"""
Test PDF upload flow
"""
import requests
import json

API_BASE = "http://localhost:8000/api"

# Test login first
email = "diana@example.com"
password = "diana123"

print("📋 TEST: PDF UPLOAD FLOW")
print("=" * 60)

# Login
print("\n1️⃣ LOGGING IN...")
login_response = requests.post(
    f"{API_BASE}/auth/login",
    json={"email": email, "password": password}
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    exit(1)

token = login_response.json()["access_token"]
print(f"✓ Login successful, got token")

# Create a simple test PDF
print("\n2️⃣ CREATING TEST PDF...")
pdf_path = "test_report.pdf"

# Create minimal valid PDF
pdf_content = b"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 150 >>
stream
BT
/F1 12 Tf
50 700 Td
(Medical Lab Report) Tj
0 -30 Td
(Glucose: 95 mg/dL) Tj
0 -20 Td
(HbA1c: 5.5) Tj
0 -20 Td
(Cholesterol: 180) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000445 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
524
%%EOF
"""

with open(pdf_path, "wb") as f:
    f.write(pdf_content)
print(f"✓ Test PDF created: {pdf_path}")

# Upload the PDF
print("\n3️⃣ UPLOADING PDF...")
with open(pdf_path, "rb") as f:
    files = {"file": ("test_report.pdf", f, "application/pdf")}
    headers = {"Authorization": f"Bearer {token}"}
    
    upload_response = requests.post(
        f"{API_BASE}/reports/upload",
        files=files,
        headers=headers
    )

print(f"Status: {upload_response.status_code}")
response_data = upload_response.json()
print(f"Response: {json.dumps(response_data, indent=2)}")

if upload_response.status_code == 200:
    print("\n✅ SUCCESS: PDF uploaded and analyzed!")
    if "report_id" in response_data:
        print(f"   Report ID: {response_data['report_id']}")
    if "data" in response_data:
        print(f"   Parsed data: {response_data['data']}")
else:
    print(f"\n❌ FAILED: {response_data.get('detail', 'Unknown error')}")

print("\n" + "=" * 60)
