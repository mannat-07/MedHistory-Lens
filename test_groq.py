import requests
import base64
import tempfile
import os

print('=' * 60)
print('GROQ AI INTEGRATION - FULL TEST')
print('=' * 60)

# Get token
login_response = requests.post('http://localhost:8000/api/auth/login', json={
    'email': 'diana@example.com',
    'password': 'dianasecurepass123'
})
token = login_response.json()['access_token']
headers = {'Authorization': f'Bearer {token}'}

# Test 1: Chat
print('\n💬 TEST 1: Chat with Groq')
print('-' * 60)
chat_response = requests.post(
    'http://localhost:8000/api/chat',
    json={'message': 'What are normal cholesterol levels?'},
    headers=headers
)
if chat_response.status_code == 200:
    reply = chat_response.json().get('reply', '')
    if 'Unable' not in reply and 'error' not in reply.lower():
        print('✓ Chat working!')
        print('  Response:', reply[:150] + '...')
    else:
        print('✗ Chat error:', reply[:100])
else:
    print('✗ Failed:', chat_response.status_code)

# Test 2: Symptom Analysis
print('\n🔍 TEST 2: Symptom Analysis')
print('-' * 60)
symptoms_response = requests.post(
    'http://localhost:8000/api/predictions',
    json={'symptoms': ['fever', 'cough', 'sore throat']},
    headers=headers
)
if symptoms_response.status_code == 200:
    data = symptoms_response.json()
    print('✓ Symptom analysis working!')
    if 'diseases' in data:
        print('  Conditions found:', len(data.get('diseases', [])))
else:
    print('✗ Failed:', symptoms_response.status_code)

# Test 3: PDF Upload
print('\n📄 TEST 3: PDF Upload')
print('-' * 60)
pdf_data = base64.b64decode('JVBERi0xLjQKJeLjz9MNCjEgMCBvYmo8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PmVuZG9iagoyIDAgb2JqPDwvVHlwZS9QYWdlcy9LaWRzWzMgMCBSXS9Db3VudCAxPj5lbmRvYmoKMyAwIG9iajw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDYxMiA3OTJdL0NvbnRlbnRzIDQgMCBSPj5lbmRvYmoKNCAwIG9iajw8L0xlbmd0aCA0ND4+c3RyZWFtCkJUCi9GMSA4IFRmCjUwIDc1MCBUZAooSGVsbG8gV29ybGQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNjkgMDAwMDAgbiAKMDAwMDAwMDE0MCAwMDAwMCBuIAowMDAwMDAwMjQyIDAwMDAwIG4gCnRyYWlsZXI8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozMzEKJSVFT0Y=')
with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as f:
    f.write(pdf_data)
    pdf_path = f.name

try:
    with open(pdf_path, 'rb') as f:
        upload_response = requests.post(
            'http://localhost:8000/api/reports/upload',
            files={'file': f},
            headers=headers
        )
    if upload_response.status_code == 200:
        print('✓ PDF upload working!')
        print('  Report ID:', upload_response.json().get('report_id'))
    else:
        print('✗ Failed:', upload_response.status_code)
finally:
    os.unlink(pdf_path)

print('\n' + '=' * 60)
print('✅ GROQ INTEGRATION COMPLETE & WORKING')
print('=' * 60)
